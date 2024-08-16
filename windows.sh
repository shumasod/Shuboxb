# Network status representation
class NetworkStatus {
    [string]$Name
    [double]$LossRate

    NetworkStatus([string]$name, [double]$lossRate) {
        $this.Name = $name
        $this.LossRate = $lossRate
    }

    [bool] IsPacketLost() {
        $randomValue = Get-Random -Maximum 1.0
        return $randomValue -lt $this.LossRate
    }
}

# Routing table represet
class RoutingTable {
    [System.Collections.Hashtable]$Routes = @{}

    [void] AddRoute([string]$network, [string]$nextHop) {
        $this.Routes[$network] = $nextHop
    }

    [string] GetNextHop([string]$network) {
        return $this.Routes[$network]
    }
}

# Router representation
class Router {
    [RoutingTable]$RoutingTable
    [int]$SentPackets = 0
    [int]$LostPackets = 0
    [int]$RoutedPackets = 0

    Router([RoutingTable]$routingTable) {
        $this.RoutingTable = $routingTable
    }

    [void] RoutePacket([string]$source, [string]$destination, [string]$data) {
        $networkStatus = Get-NetworkStatus $source $destination

        # Increment sent packets
        $this.SentPackets++

        # Check if packet is lost
        if ($networkStatus.IsPacketLost()) {
            Write-Host "Packet lost"
            $this.LostPackets++
            return
        }

        # Get next hop from routing table
        $nextHop = $this.RoutingTable.GetNextHop($networkStatus.Name)

        # Increment routed packets
        $this.RoutedPackets++

        # Send packet to next hop
        Send-Packet $nextHop $destination $data
    }

    [pscustomobject] GetStatistics() {
        return [pscustomobject]@{
            SentPackets    = $this.SentPackets
            LostPackets    = $this.LostPackets
            RoutedPackets  = $this.RoutedPackets
        }
    }
}

# Get network status
function Get-NetworkStatus([string]$source, [string]$destination) {
    if ($source -eq "A" -and $destination -eq "B") {
        return [NetworkStatus]::new("A-B", 0.1)
    }
    elseif ($source -eq "B" -and $destination -eq "A") {
        return [NetworkStatus]::new("B-A", 0.2)
    }
    else {
        throw "Invalid source-destination pair"
    }
}

# Send packet
function Send-Packet([string]$nextHop, [string]$destination, [string]$data) {
    Write-Host "Sending packet to $nextHop: $data -> $destination"
}

# Segment 1 routing table
$routingTableSegment1 = [RoutingTable]::new()
$routingTableSegment1.AddRoute("A-B", "Segment2")
$routingTableSegment1.AddRoute("B-A", "Segment2")

# Segment 2 routing table
$routingTableSegment2 = [RoutingTable]::new()
$routingTableSegment2.AddRoute("A-B", "Segment1")
$routingTableSegment2.AddRoute("B-A", "Segment1")

# Segment 1 router
$routerSegment1 = [Router]::new($routingTableSegment1)

# Segment 2 router
$routerSegment2 = [Router]::new($routingTableSegment2)

# Route packets
$routerSegment1.RoutePacket("A", "B", "Data1")
$routerSegment2.RoutePacket("B", "A", "Data2")

# Get statistics
$statistics1 = $routerSegment1.GetStatistics()
$statistics2 = $routerSegment2.GetStatistics()

Write-Host ("Segment1 Statistics: Sent={0}, Lost={1}, Routed={2}" -f $statistics1.SentPackets, $statistics1.LostPackets, $statistics1.RoutedPackets)
Write-Host ("Segment2 Statistics: Sent={0}, Lost={1}, Routed={2}" -f $statistics2.SentPackets, $statistics2.LostPackets, $statistics2.RoutedPackets)
