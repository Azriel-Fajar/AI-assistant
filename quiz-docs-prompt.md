# Prompt: Generate Q&A Documentation File

Create a well-formatted documentation file that lays out the following questions and answers organized by module. Each module's Q&A pairs should be grouped in sets of 5.

Format each group like this:

```
## Module X — [Module Title]

### Group 1
1. Q: [question]
   A: [answer]
2. Q: ...
   A: ...
(up to 5 per group)

### Group 2
...
```

Use clean markdown. No extra commentary. Just the structured doc.

---

## Module 1 — Explaining Network Topologies

### Group 1
1. Q: What is a peer-to-peer network?
   A: A network where each device can act as both client and server
2. Q: What is a Local Area Network?
   A: A network confined to a single geographical location
3. Q: What is an example of a LAN type?
   A: SOHO
4. Q: What does SOHO stand for?
   A: Small Office Home Office
5. Q: In a client-server network model, which device provides resources?
   A: The central server

### Group 2
6. Q: In a star topology, what is the central device?
   A: Concentrator
7. Q: In a point-to-point topology, how many nodes are there?
   A: Two
8. Q: What is half-duplex communication?
   A: A node cannot transmit and receive at the same time
9. Q: What is a significant disadvantage of a star topology?
   A: The concentrator is a single point of failure
10. Q: What is full-duplex communication?
    A: Nodes can transmit and receive simultaneously

### Group 3
11. Q: In a fully connected mesh network, each node has a point-to-point link to what?
    A: Every other node
12. Q: What is a partial mesh network?
    A: A network where only some nodes have point-to-point links to every other node
13. Q: What device is used to overcome the maximum transmission distance?
    A: Repeater
14. Q: What does an Ethernet hub do when it receives a signal?
    A: Repeats the signal to all nodes acting as a logical bus
15. Q: How is the number of required links in a mesh network calculated?
    A: n(n-1)/2

### Group 4
16. Q: Which OSI layer is responsible for transmitting raw bits over the physical medium?
    A: Physical
17. Q: How many layers does the OSI model have?
    A: 7
18. Q: What is the correct order of the OSI model layers from bottom to top?
    A: Physical, Data Link, Network, Transport, Session, Presentation, Application
19. Q: What advantage does a mesh topology provide?
    A: Resilience if some nodes or links fail
20. Q: What mnemonic is used to remember the OSI layers from bottom to top?
    A: Please Do Not Throw Sausage Pizza Away

### Group 5
21. Q: Which OSI layer transfers data between nodes on the same logical segment using hardware addresses?
    A: Data Link
22. Q: What does the Data Link layer use to identify host interfaces?
    A: MAC address
23. Q: What does Layer 2 use to organize a stream of bits into frames?
    A: Encapsulation
24. Q: What is an example of a Data Link layer device?
    A: Switch
25. Q: What is an example of a Physical layer device?
    A: Hub

### Group 6
26. Q: Which OSI layer is responsible for moving data around a network of networks using network and host IDs?
    A: Network
27. Q: Which OSI layer tracks communication between applications and segments data?
    A: Transport
28. Q: What is an example of a Network layer device?
    A: Router
29. Q: What address is assigned to data at the Network layer?
    A: IP address
30. Q: What is an example of a Transport layer device?
    A: Multilayer switch

### Group 7
31. Q: What does the Session layer perform when two applications begin communicating?
    A: Authentication and session establishment
32. Q: What is an example of a Session layer protocol?
    A: NetBIOS
33. Q: How does the Transport layer identify which application should receive incoming data?
    A: By port number
34. Q: Which OSI layer handles data encryption/decryption and compression?
    A: Presentation
35. Q: Which OSI layer establishes and manages connections between applications?
    A: Session

### Group 8
36. Q: Which OSI layer interacts directly with end-user software applications?
    A: Application
37. Q: What is an example of an Application layer protocol?
    A: SMTP
38. Q: Which OSI layer converts human-readable data into machine-readable format?
    A: Application
39. Q: What is the function of the WAN port on a SOHO router?
    A: Connect to the Internet Service Provider network
40. Q: What is an example of a Presentation layer standard?
    A: MIME

### Group 9
41. Q: What does the DHCP server in a SOHO router perform?
    A: Provides each host with an IP address
42. Q: At which OSI layer does a SOHO router's Ethernet switch function?
    A: Data Link
43. Q: What is the binary representation of the decimal number 132?
    A: 10000100
44. Q: What identifies each host interface on a SOHO router at the Data Link layer?
    A: MAC address
45. Q: What is the decimal equivalent of the binary number 11001101?
    A: 205

### Group 10
46. Q: What is the first step in CompTIA's troubleshooting methodology?
    A: Identify the problem
47. Q: What is the final step in CompTIA's troubleshooting methodology?
    A: Document findings, actions, and outcomes
48. Q: When should escalation be considered?
    A: When the problem is beyond your knowledge, under warranty, or very large in scope
49. Q: Which troubleshooting question type invites a yes/no response?
    A: Closed question
50. Q: Which troubleshooting approach starts from the Physical layer and moves upward?
    A: Bottom-up approach

---

## Module 2 — Supporting Cabling and Physical Installations

### Group 1
1. Q: What is the purpose of CSMA/CD?
   A: To regulate communication in networks with shared transmission mediums
2. Q: What IEEE standard defines the physical layer for Ethernet?
   A: IEEE 802.3
3. Q: Which cable category is required for 1000Base-T?
   A: Cat6 or higher
4. Q: What happens when two devices transmit simultaneously in Ethernet?
   A: A jam signal is sent and a backoff algorithm is used
5. Q: What is the data transfer rate of 10Base-T?
   A: 10 Mbps

### Group 2
6. Q: What is the maximum speed supported by 10GBase-T?
   A: 10 Gbps
7. Q: Which fiber Ethernet standard uses Single Mode Fiber and supports 10 Gbps over long distances?
   A: 10GBase-LR
8. Q: Which cable type is described as cost-effective and popular for LANs with minimal EMI protection?
   A: Unshielded Twisted Pair (UTP)
9. Q: Which cable type provides EMI protection and is suitable for high-interference environments?
   A: STP
10. Q: Which standard uses Multimode Fiber OM2/OM3/OM4 for 10 Gbps?
    A: 10GBase-SR

### Group 3
11. Q: What distinguishes riser-rated cable from plenum-rated cable?
    A: Riser-rated cable is used in vertical spaces between floors and is more cost-effective
12. Q: Which connector is used for telephone and modem connections?
    A: RJ11
13. Q: What is the maximum bandwidth supported by an RJ45 connector over Ethernet?
    A: 10 Gbps
14. Q: Where is plenum-rated cable typically installed?
    A: Plenum spaces with fire safety requirements
15. Q: What is the configuration of an RJ45 connector?
    A: 8 positions, 8 connectors

### Group 4
16. Q: Which cable type uses two inner conductors in a twisted pair, suited for 10 Gb Ethernet over very short ranges?
    A: Twinaxial
17. Q: What is the function of the Work Area in structured cabling?
    A: Serves as the user connection point
18. Q: What is the purpose of a patch panel in structured cabling?
    A: To facilitate cable management and enable easy reconfiguration of connections
19. Q: What connectors are used with coaxial cable?
    A: BNC, TNC, and SMA
20. Q: What does the backbone cabling in a structured cabling system provide?
    A: Vertical connections between floors

### Group 5
21. Q: What is the correct sequence for structured cable installation?
    A: Prepare → Pull Cable → Terminate → Test → Document
22. Q: Which termination standard uses green/white-green wires in positions 1 and 2?
    A: T568A
23. Q: What tool is used to attach connectors to the ends of cables?
    A: Crimp Tool
24. Q: What tool is used to terminate cable wires in punch down blocks?
    A: Punch-Down Tool
25. Q: What tool is used to safely remove insulation from a cable without nicking the wires?
    A: Cable Stripper

### Group 6
26. Q: What is the function of the cladding in a fiber optic cable?
    A: To reflect light back into the core
27. Q: What is the key advantage of single mode fiber (SMF) over multimode fiber (MMF)?
    A: Suitable for longer distances with higher bandwidth
28. Q: What is the core of a fiber optic cable made of?
    A: Ultra-pure glass strands
29. Q: What is the maximum data transmission speed achievable with fiber optic cables?
    A: 800 Gbps
30. Q: Which fiber connector uses a bayonet twist-lock mechanism and is older but still widely used?
    A: ST

### Group 7
31. Q: What does WDM stand for?
    A: Wavelength Division Multiplexing
32. Q: Which fiber connector is preferred for heavily populated patch panels due to its small 1.25 mm ferrule?
    A: LC
33. Q: What ferrule size does the SC (Subscriber Connector) use?
    A: 2.5 mm
34. Q: Which WDM technology supports up to 160 channels?
    A: DWDM
35. Q: What wavelengths does BiDi WDM use for transmit and receive?
    A: 1310 nm Tx and 1490 nm Rx

### Group 8
36. Q: What is the role of a UPS (Uninterruptible Power Supply)?
    A: To provide system-level power continuity during outages
37. Q: Which fire suppression system uses a pre-action mechanism?
    A: Pre-action sprinkler
38. Q: Which type of fire extinguisher should be used for electrical fires?
    A: Class C
39. Q: What does PDU stand for?
    A: Power Distribution Unit
40. Q: What is the EIA standard rack width?
    A: 48.26 cm

### Group 9
41. Q: What causes Near End Crosstalk (NEXT)?
    A: Excessive untwisting or faulty shields at the transmitter end
42. Q: What is alien crosstalk?
    A: Interference caused by signal overlap between adjacent cables
43. Q: What measurement unit is used to express signal attenuation?
    A: dB (decibels)
44. Q: What does signal attenuation mean?
    A: Loss of signal strength in networking cables measured in decibels
45. Q: What is NEXT in cable troubleshooting terminology?
    A: Near End Crosstalk

### Group 10
46. Q: What is goodput?
    A: Throughput at the application layer accounting for packet loss
47. Q: What tool is used to trace cables through walls or identify active cables in a bundle?
    A: Tone Generator (Fox and Hound)
48. Q: What is a common symptom of a cabling issue in a network?
    A: Random disconnections and reconnections
49. Q: What does a Wire Map Tester detect?
    A: Improper cable termination including open circuits, shorts, and incorrect pin-outs
50. Q: At what layer is throughput measured?
    A: Network/Transport Layer

---

## Module 3 — Configuring Interfaces and Switches

### Group 1
1. Q: What symptom is commonly associated with a faulty NIC?
   A: Network connectivity failure
2. Q: What is a key characteristic of a NIC?
   A: It has a unique MAC address
3. Q: What is the primary function of a Network Interface Card (NIC)?
   A: To connect the host to a transmission medium
4. Q: At which OSI layer does a NIC operate?
   A: Data Link layer
5. Q: What distinguishes modular transceivers from NICs?
   A: Modular transceivers can terminate multiple types of cable and connector types

### Group 2
6. Q: What does the Preamble field in an Ethernet frame provide?
   A: A synchronization sequence
7. Q: What is a symptom of mismatched ports on a transceiver?
   A: No link
8. Q: What symptom is related to signal strength issues on a transceiver?
   A: Packet loss
9. Q: At which OSI layer do modular transceivers operate?
   A: Data Link layer
10. Q: What is the purpose of the SFD field in an Ethernet frame?
    A: It signals the start of the frame

### Group 3
11. Q: What notation format is used to represent a MAC address?
    A: Pairs of hexadecimal digits separated by colons or hyphens
12. Q: What does the FCS field in an Ethernet frame do?
    A: Provides an error-checking code
13. Q: What does the Ether Type field in an Ethernet frame indicate?
    A: The protocol of the payload
14. Q: How many bits make up a MAC address?
    A: 48 bits
15. Q: Which field in an Ethernet frame contains the address of the recipient device?
    A: Destination MAC

### Group 4
16. Q: Which portion of a MAC address represents the OUI?
    A: The first 3 bytes
17. Q: How does a hub handle incoming network transmissions?
    A: It sends transmissions from one port to every other port
18. Q: What happens when a device receives a frame with an all-1s destination MAC address?
    A: All hosts on that network receive and process the packet
19. Q: What type of address is an all-1s destination MAC address?
    A: Broadcast
20. Q: What does OUI stand for?
    A: Organizationally Unique Identifier

### Group 5
21. Q: What type of Ethernet switch can be configured by an administrator?
    A: Managed switch
22. Q: What mechanism does a switch use to forward data to a specific device?
    A: MAC address tables
23. Q: What is the primary function of a bridge in networking?
    A: To separate physical network segments while keeping all nodes in the same logical network
24. Q: What is the main difference between a hub and a switch in forwarding behavior?
    A: A switch sends traffic only to the destination port; a hub sends to all ports
25. Q: At which OSI layer does a bridge primarily operate?
    A: Data Link layer

### Group 6
26. Q: What is a key benefit of link aggregation?
    A: Redundancy
27. Q: Which Ethernet switch type comes with a preset number of ports that cannot be changed?
    A: Fixed switch
28. Q: Which switch form factor is designed to fit into networking racks?
    A: Rack-mounted switch
29. Q: What does Link Aggregation (NIC Teaming) combine?
    A: Two separate cabled links into a single logical channel
30. Q: What is the key benefit of a stackable switch?
    A: Multiple switches can be connected and managed as a single unit

### Group 7
31. Q: What is the standard MTU (Maximum Transmission Unit) size for Ethernet?
    A: 1500 bytes
32. Q: What is a Jumbo Frame in Ethernet networking?
    A: A frame with a payload larger than standard Ethernet MTU (up to 9216 bytes)
33. Q: What is a limitation of using Jumbo Frames?
    A: They break Ethernet standards and have limited compatibility
34. Q: At which OSI layer does STP operate?
    A: Data Link layer (Layer 2)
35. Q: What is the purpose of the Spanning Tree Protocol (STP)?
    A: To prevent bridge loops and provide fault tolerance

### Group 8
36. Q: What does Power over Ethernet (PoE) allow?
    A: One cable to transmit both data and electrical power to networked devices
37. Q: What does a solid green port status indicator on a switch indicate?
    A: The link is connected but there is no traffic
38. Q: What cable category is the minimum required for PoE?
    A: Cat 5e or better
39. Q: What does a flickering green port status indicator mean?
    A: The link is operating normally with traffic
40. Q: What conductor thickness is recommended for optimal PoE performance?
    A: 23 AWG

### Group 9
41. Q: Which CLI command shows the active configuration currently used by a switch?
    A: show running-config
42. Q: What does blinking amber on a switch port indicate?
    A: A fault has been detected
43. Q: Which switch show command displays the configuration the device will use upon next restart?
    A: show startup-config
44. Q: What does a "down/down" interface status on a switch indicate?
    A: Both Layer 1 physical and Layer 2 data link connections are inactive
45. Q: What does a solid amber port status indicator on a switch port indicate?
    A: The port is blocked by the spanning tree algorithm

### Group 10
46. Q: What causes a CRC (Cyclic Redundancy Check) error?
    A: The frame's calculated checksum does not match the transmitted checksum due to noise or interference
47. Q: What is a Runt Frame in Ethernet?
    A: A frame that is smaller than the minimum frame size
48. Q: What does "administratively down/down" status mean on a switch interface?
    A: The interface has been manually disabled by an administrator using the shutdown command
49. Q: What causes Giant Frame errors?
    A: Misconfiguration or malfunctioning network devices causing frames to exceed the maximum allowed size
50. Q: What is the cause of broadcast storms?
    A: Very large broadcast domains or DHCP issues

---

## Module 4 — Configuring Network Addressing

### Group 1
1. Q: What is the primary function of a subnet mask?
   A: Identify the network portion of an IP address
2. Q: How many octets does an IPv4 address have?
   A: 4
3. Q: What is the total bit length of an IPv4 address?
   A: 32 bits
4. Q: What does the Network ID portion of an IP address identify?
   A: The common portion shared by all hosts on the same IP network
5. Q: What does the Host ID portion of an IP address identify?
   A: The specific host within an IP network

### Group 2
6. Q: Which address type sends data to a specific group of host IP addresses?
   A: Multicast
7. Q: What is the purpose of Address Resolution Protocol (ARP)?
   A: Resolve IP addresses to MAC addresses
8. Q: Which address type sends data to all hosts on a network or subnet?
   A: Broadcast
9. Q: For 192.168.1.x with subnet mask 255.255.255.0, what is the broadcast address?
   A: 192.168.1.255
10. Q: Which address type sends data only to a single destination host?
    A: Unicast

### Group 3
11. Q: What is the decimal value of the binary number 11000011?
    A: 195
12. Q: Which IPv4 header field indicates how long the packet is allowed to survive?
    A: Time to Live (TTL)
13. Q: Which private IP address range belongs to Class B?
    A: 172.16.0.0 to 172.31.255.255
14. Q: Which private IP address range belongs to Class A?
    A: 10.0.0.0 to 10.255.255.255
15. Q: Which IPv4 header field identifies the upper-layer protocol?
    A: Protocol

### Group 4
16. Q: What does CIDR stand for?
    A: Classless Inter-Domain Routing
17. Q: Which private IP address range belongs to Class C?
    A: 192.168.0.0 to 192.168.255.255
18. Q: What is the key feature of VLSM?
    A: It creates subnets of different sizes within the same network
19. Q: What happens when bits are borrowed from the host portion?
    A: Available network addresses increase and usable host addresses in each subnet decrease
20. Q: Who assigns public IP addresses?
    A: Internet Service Providers (ISPs)

### Group 5
21. Q: What additional information does 'ipconfig /all' display?
    A: Complete TCP/IP configuration including DHCP server address and MAC address
22. Q: Which Windows command-line tool shows the IP address, subnet mask, and default gateway?
    A: ipconfig
23. Q: What is the last subnet when borrowing two bits from the host portion of 192.168.89.0/24?
    A: 192.168.89.192
24. Q: What is the CIDR prefix notation for a subnet mask of 255.255.255.128?
    A: /25
25. Q: What subnet mask results from borrowing one bit from the host portion of 192.168.89.0/24?
    A: 255.255.255.128

### Group 6
26. Q: What is the modern replacement for the legacy 'ifconfig' command?
    A: ip addr
27. Q: Which command shows the status of all network interfaces?
    A: ip link
28. Q: What is the function of 'ipconfig /renew'?
    A: Renews the client's DHCP-leased IP address
29. Q: What is the function of 'ipconfig /release'?
    A: Releases the client's DHCP-leased IP address
30. Q: Which command enables or disables a network interface on Linux?
    A: ip link set eth0 up|down

### Group 7
31. Q: What does the command 'arp -d' do?
    A: Deletes all entries in the ARP cache
32. Q: What is the primary purpose of the 'ping' command?
    A: Test connectivity with a given IP address
33. Q: What is the function of 'arp -s IPAddress MACAddress'?
    A: Adds a static entry to the ARP cache
34. Q: What does the command 'arp -a' display?
    A: The contents of the ARP cache
35. Q: Which ping error message indicates the router cannot find a path?
    A: Destination host unreachable

### Group 8
36. Q: What notation format is used for IPv6 addresses?
    A: Hexadecimal
37. Q: How many bits does an IPv6 address contain?
    A: 128 bits
38. Q: How many 16-bit groups are in an IPv6 address?
    A: 8
39. Q: In an IPv6 address, the first 64 bits are used for which purpose?
    A: Network ID
40. Q: How many total addresses does IPv6 support?
    A: 340 undecillion (3.4 x 10^38)

### Group 9
41. Q: Which IPv6 prefix is used for global unicast addresses?
    A: 2000::/3
42. Q: What is the link local address range for IPv6?
    A: fe80::/10
43. Q: What is the IPv6 canonical notation for 2001:0db8:0000:0000:0abc:0000:def0:1234?
    A: 2001:db8::abc:0:def0:1234
44. Q: Globally scoped unicast addresses are the equivalent of which IPv4 addresses?
    A: Public IPv4 addresses
45. Q: IPv6 link local addresses are equivalent to which IPv4 addressing?
    A: IPv4 private addressing

### Group 10
46. Q: What does the Dual Stack IPv4/IPv6 transition mechanism allow?
    A: Allows IPv4 and IPv6 to run simultaneously
47. Q: What does the Tunneling IPv4/IPv6 transition mechanism do?
    A: Encapsulates IPv6 packets within IPv4 packets to traverse IPv4 networks
48. Q: Which IPv6 address type is used for load balancing by sending traffic to the closest device?
    A: Anycast
49. Q: Which IPv6 prefix is used for multicast addresses?
    A: ff00::/8
50. Q: What is the purpose of NAT64 in IPv4/IPv6 transition?
    A: Translates IPv6 into IPv4 and vice versa
