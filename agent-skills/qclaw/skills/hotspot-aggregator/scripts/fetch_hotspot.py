#!/usr/bin/env python3
"""
热点数据获取脚本
从真实API获取热点数据，支持跨平台热点聚合
输出JSON数据供智能体按output-templates.md格式化
"""

import argparse
import json
import os
import socket
import ssl
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# API配置
API_HOST = "onetotenvip.com"
API_PORT = 443
API_PATH = "/story/hotKeyword/list"


def fetch_from_api(start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict:
    """
    从API获取热点数据（使用原生socket+ssl，不发送SNI）

    Args:
        start_date: 开始时间（包含），格式 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS
        end_date: 结束时间（不包含），格式 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS

    Returns:
        热点数据字典
    """
    # 构建请求参数，自动补全时分秒
    start_date_param = None
    end_date_param = None

    if start_date:
        if len(start_date) == 10:
            start_date_param = f"{start_date} 00:00:00"
        else:
            start_date_param = start_date
    if end_date:
        if len(end_date) == 10:
            end_date_param = f"{end_date} 00:00:00"
        else:
            end_date_param = end_date

    is_realtime = False
    if not start_date_param and not end_date_param:
        is_realtime = True
        now = datetime.now()
        one_hour_ago = now - timedelta(hours=1)
        start_date_param = one_hour_ago.strftime("%Y-%m-%d %H:00:00")
        end_date_param = now.strftime("%Y-%m-%d %H:00:00")

    try:
        # 构建请求体
        body = {"source": "全平台热搜推荐-skillhub"}
        if start_date_param:
            body["startDate"] = start_date_param
        if end_date_param:
            body["endDate"] = end_date_param
        body_json = json.dumps(body, ensure_ascii=False)

        # 构建HTTP请求
        http_request = (
            f"POST {API_PATH} HTTP/1.1\r\n"
            f"Host: {API_HOST}\r\n"
            f"Content-Type: application/json\r\n"
            f"Content-Length: {len(body_json.encode('utf-8'))}\r\n"
            f"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n"
            f"Connection: close\r\n"
            f"\r\n"
            f"{body_json}"
        )

        # 创建socket连接
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(15)
        sock.connect((API_HOST, API_PORT))

        # 包装SSL（不传server_hostname，不发送SNI）
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        ssl_sock = context.wrap_socket(sock)  # 关键：不传server_hostname

        # 发送请求
        ssl_sock.sendall(http_request.encode('utf-8'))

        # 接收响应
        response_data = b""
        while True:
            chunk = ssl_sock.recv(4096)
            if not chunk:
                break
            response_data += chunk

        ssl_sock.close()
        sock.close()

        # 解析HTTP响应
        response_str = response_data.decode('utf-8')

        # 分离header和body
        header_body_split = response_str.split('\r\n\r\n', 1)
        if len(header_body_split) != 2:
            return {
                "status": "error",
                "message": "HTTP响应格式错误",
                "data": None
            }

        headers_raw, body_raw = header_body_split

        # 检查HTTP状态码
        first_line = headers_raw.split('\r\n')[0]
        if '200' not in first_line:
            return {
                "status": "error",
                "message": f"HTTP请求失败: {first_line}",
                "data": None
            }

        raw_data = json.loads(body_raw)

        # 检查返回码
        if raw_data.get("code") != 2000:
            return {
                "status": "error",
                "message": f"API返回错误: {raw_data.get('msg', '未知错误')}",
                "data": None
            }

        return transform_api_data(raw_data, start_date_param, end_date_param, is_realtime)

    except socket.error as e:
        return {
            "status": "error",
            "message": f"网络连接失败: {str(e)}",
            "data": None
        }
    except json.JSONDecodeError as e:
        return {
            "status": "error",
            "message": f"JSON解析失败: {str(e)}",
            "data": None
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"数据处理失败: {str(e)}",
            "data": None
        }


def transform_api_data(raw_data: Dict, start_date: Optional[str], end_date: Optional[str], is_realtime: bool = False) -> Dict:
    """
    将API返回的数据转换为output-templates.md所需的格式

    Args:
        raw_data: API返回的原始数据
        start_date: 查询开始时间
        end_date: 查询结束时间
        is_realtime: 是否为实时查询

    Returns:
        转换后的热点数据
    """
    data_list = raw_data.get("data", [])

    # 收集所有热点项（忽略接口的keyword分组）
    all_hotspots = []

    for item in data_list:
        keyword = item.get("keyword", "")
        plats = item.get("plats", [])
        hot_spot_list = item.get("hotSpotList", [])

        for spot in hot_spot_list:
            spot["source_keyword"] = keyword  # 记录来源关键词（供参考）
            # 处理标题中的空格
            if spot.get("title"):
                spot["title"] = spot["title"].replace(" ", "")
            # 处理URL中的空格（影响Markdown链接解析）
            if spot.get("url"):
                spot["url"] = spot["url"].replace(" ", "%20")
            all_hotspots.append(spot)

    # 构建返回数据
    stat_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    result = {
        "status": "success",
        "stat_time": stat_time,
        "timestamp": datetime.now().isoformat(),
        "source": "api",
        "total_count": len(all_hotspots),
        "hotspots": all_hotspots
    }

    # 添加查询范围信息
    if is_realtime:
        result["query_range"] = {
            "type": "realtime",
            "start_date": start_date,
            "end_date": end_date
        }
    else:
        result["query_range"] = {
            "type": "historical",
            "start_date": start_date,
            "end_date": end_date
        }

    return result


def main():
    parser = argparse.ArgumentParser(description='获取热点数据')
    parser.add_argument('--output', type=str, default='json',
                        choices=['json', 'markdown'],
                        help='输出格式：json或markdown')
    parser.add_argument('--start-date', type=str, default=None,
                        help='开始时间（包含），格式 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS')
    parser.add_argument('--end-date', type=str, default=None,
                        help='结束时间（不包含），格式 YYYY-MM-DD 或 YYYY-MM-DD HH:MM:SS')

    args = parser.parse_args()

    result = fetch_from_api(args.start_date, args.end_date)

    if args.output == 'json':
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        # 简单的markdown格式输出（仅用于测试）
        if result["status"] == "success":
            query_type = result.get("query_range", {}).get("type", "realtime")
            print(f"# 热点数据获取成功\n")
            print(f"统计时间: {result['stat_time']}\n")
            if query_type == "historical":
                print(f"查询范围: {result['query_range']['start_date']} ~ {result['query_range']['end_date']}\n")
            print(f"热点数量: {result['total_count']}\n")
            for i, spot in enumerate(result['hotspots'][:10], 1):
                print(f"- {i}. {spot['title']} | 平台: {spot['platName']} | 热度: {spot['maxHotScore']}")
        else:
            print(f"# 错误\n{result['message']}")


if __name__ == "__main__":
    main()
