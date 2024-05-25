コードを実行可能な状態に修正しました。主な変更点は以下の通りです。

1. `System.Random` モジュールをインポートしました。
2. `getStdRandom` 関数を使用して乱数を生成するよう変更しました。
3. `main` 関数内で `routerSegment1'` と `routerSegment2'` の初期化順序を入れ替えました。

修正後のコードは以下の通りです。

```haskell
import System.Random

-- Network status representation
data NetworkStatus = NetworkStatus { name :: String, lossRate :: Double }

isPacketLost :: NetworkStatus -> IO Bool
isPacketLost (NetworkStatus _ lossRate) = do
    randomValue <- getStdRandom random
    return $ randomValue < lossRate

-- Routing table representation
data RoutingTable = RoutingTable { routes :: [(String, String)] }

addRoute :: RoutingTable -> String -> String -> RoutingTable
addRoute (RoutingTable routes) network nextHop =
    RoutingTable ((network, nextHop) : routes)

getNextHop :: RoutingTable -> String -> Maybe String
getNextHop (RoutingTable routes) network =
    lookup network routes

-- Router representation
data Router = Router
    { routingTable :: RoutingTable
    , sentPackets :: Int
    , lostPackets :: Int
    , routedPackets :: Int
    }

routePacket :: Router -> String -> String -> String -> IO Router
routePacket router source destination data' = do
    networkStatus <- getNetworkStatus source destination
    packetLost <- isPacketLost networkStatus
    let router' =
            Router
                { sentPackets = sentPackets router + 1
                , lostPackets =
                      if packetLost
                          then lostPackets router + 1
                          else lostPackets router
                , routedPackets =
                      if packetLost
                          then routedPackets router
                          else routedPackets router + 1
                , routingTable = routingTable router
                }
    if packetLost
        then do
            putStrLn "Packet lost"
            return router'
        else do
            case getNextHop (routingTable router) (name networkStatus) of
                Nothing -> return router'
                Just nextHop -> do
                    sendPacket nextHop destination data'
                    return router'

getStatistics :: Router -> (Int, Int, Int)
getStatistics router =
    (sentPackets router, lostPackets router, routedPackets router)

-- Get network status
getNetworkStatus :: String -> String -> IO NetworkStatus
getNetworkStatus source destination
    | source == "A" && destination == "B" =
        return $ NetworkStatus "A-B" 0.1
    | source == "B" && destination == "A" =
        return $ NetworkStatus "B-A" 0.2
    | otherwise =
        error "Invalid source-destination pair"

-- Send packet
sendPacket :: String -> String -> String -> IO ()
sendPacket nextHop destination data' =
    putStrLn $ "Sending packet to " ++ nextHop ++ ": " ++ data' ++ " -> " ++ destination

main :: IO ()
main = do
    let routerSegment2 = Router (RoutingTable [("A-B", "Segment1"), ("B-A", "Segment1")]) 0 0 0
    let routerSegment1 = Router (RoutingTable [("A-B", "Segment2"), ("B-A", "Segment2")]) 0 0 0

    routerSegment2' <- routePacket routerSegment2 "B" "A" "Data2"
    routerSegment1' <- routePacket routerSegment1 "A" "B" "Data1"

    let (sent2, lost2, routed2) = getStatistics routerSegment2'
    let (sent1, lost1, routed1) = getStatistics routerSegment1'

    putStrLn $ "Segment2 Statistics: Sent=" ++ show sent2 ++ ", Lost=" ++ show lost2 ++ ", Routed=" ++ show routed2
    putStrLn $ "Segment1 Statistics: Sent=" ++ show sent1 ++ ", Lost=" ++ show lost1 ++ ", Routed=" ++ show routed1
```

