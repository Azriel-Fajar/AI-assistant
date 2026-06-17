---
name: reference-subnetting
description: IPv4 subnetting knowledge -- prefix notation, subnet masks, borrowing bits, block size, host ranges
metadata:
  type: reference
---

# IPv4 Subnetting Reference

Source: `subnet_mask_and_prefix_explanation.md` in JARVIS root.

## Core Formulas

```
New prefix       = original prefix + borrowed bits
Host bits        = 32 - prefix
Subnets          = 2^borrowed bits
Total addresses  = 2^host bits
Usable hosts     = 2^host bits - 2
Block size       = 256 - subnet mask value in changed octet
```

## Common Prefixes

| Prefix | Subnet Mask     | Host Bits |
|--------|-----------------|-----------|
| /24    | 255.255.255.0   | 8         |
| /25    | 255.255.255.128 | 7         |
| /26    | 255.255.255.192 | 6         |
| /27    | 255.255.255.224 | 5         |
| /28    | 255.255.255.240 | 4         |
| /29    | 255.255.255.248 | 3         |
| /30    | 255.255.255.252 | 2         |

## Example: 192.168.89.0/24 borrow 2 bits → /26

- New mask: 255.255.255.192
- Block size: 256 - 192 = 64
- 4 subnets, 62 usable hosts each

| Subnet | Network ID        | First Host    | Last Host      | Broadcast      |
|--------|-------------------|---------------|----------------|----------------|
| 1      | 192.168.89.0/26   | 192.168.89.1  | 192.168.89.62  | 192.168.89.63  |
| 2      | 192.168.89.64/26  | 192.168.89.65 | 192.168.89.126 | 192.168.89.127 |
| 3      | 192.168.89.128/26 | 192.168.89.129| 192.168.89.190 | 192.168.89.191 |
| 4      | 192.168.89.192/26 | 192.168.89.193| 192.168.89.254 | 192.168.89.255 |

## Key Concepts

- **Prefix** = how many bits are network portion
- **Subnet mask** = same info in decimal (1s = network, 0s = host)
- **Borrowing bits** = take from host portion → more subnets, smaller each
- **-2 for usable hosts** = network ID + broadcast address reserved
- **Block size** = increment between subnet network IDs
