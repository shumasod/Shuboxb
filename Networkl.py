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

# ルーターを表すクラス
class Router:
    def __init__(self, routing_table):
        self.routing_table = routing_table

    def route_packet(self, source, destination, data):
        # ネットワークの状況を取得
        network_status = get_network_status(source, destination)

        # パケット損失率に基づいて、パケットが途切れるかどうかを判断
        if network_status.is_packet_lost():
            print("パケットが途切れました")
            return

        # ルーティングテーブルから次のホップを取得
        next_hop = self.routing_table.get_next_hop(network_status.name)

        # パケットを次のホップに送信
        send_packet(next_hop, destination, data)

# ネットワークの状況を取得する関数
def get_network_status(source, destination):
    # 実際のネットワーク状況に基づいて、適切なNetworkStatusオブジェクトを返す
    if source == "A" and destination == "B":
        return NetworkStatus("A-B", 0.1)
    elif source == "B" and destination == "A":
        return NetworkStatus("B-A", 0.2)
    else:
        return NetworkStatus("default", 0.0)

# パケットを送信する関数
def send_packet(next_hop, destination, data):
    # 実際のネットワークにパケットを送信
    print(f"パケットを {next_hop} から {destination} に送信しました: {data}")

# サンプルコードの実行
routing_table = RoutingTable()
routing_table.add_route("A-B", "B")
routing_table.add_route("B-A", "A")

router = Router(routing_table)

while True:
    # 送信元と送信先、データを入力
    source = input("送信元: ")
    destination = input("送信先: ")
    data = input("データ: ")

    # パケットをルーティング
    router.route_packet(source, destination, data)

    # 一定時間待機
    time.sleep(1)
