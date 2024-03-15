import random
import time

# ネットワークの状況を表すクラス
class NetworkStatus:
    def __init__(self, name, loss_rate):
        self.name = name
        self.loss_rate = loss_rate

    def is_packet_lost(self):
        return random.random() < self.loss_rate

# ルーティングテーブルを表すクラス
class RoutingTable:
    def __init__(self):
        self.routes = {}

    def add_route(self, network, next_hop):
        self.routes[network] = next_hop

    def get_next_hop(self, network):
        return self.routes.get(network)

# 
class Router:
    def __init__(self, routing_table):
        self.routing_table = routing_table
        self.sent_packets = 0
        self.lost_packets = 0
        self.routed_packets = 0

    def route_packet(self, source, destination, data):
        # ネットワークの状況を取得
        network_status = get_network_status(source, destination)

        # パケット送信前に送信済みパケット数をインクリメント
        self.sent_packets += 1

        # パケット損失率に基づいて、パケットが途切れるかどうかを判断
        if network_status.is_packet_lost():
            print("パケットが途切れました")
            self.lost_packets += 1
            return

        # ルーティングテーブルから次のホップを取得
        next_hop = self.routing_table.get_next_hop(network_status.name)

        # パケット送信後にルーティング済みパケット数をインクリメント
        self.routed_packets += 1

        # パケットを次のホップに送信
        send_packet(next_hop, destination, data)

    def get_statistics(self):
        return {
            "sent_packets": self.sent_packets,
            "lost_packets": self.lost_packets,
            "routed_packets": self.routed_packets,
        }

# ネットワークの状況を取得する関数
def get_network_status(source, destination):
    # 実際のネットワーク状況に基づいて、適切なNetworkStatusオブジェクトを返す
    if source == "A" and destination == "B":
        return NetworkStatus("A-B", 0.1)
    elif source == "B" and destination == "A":
        return NetworkStatus("B-A", 0.2)
    else:
   
