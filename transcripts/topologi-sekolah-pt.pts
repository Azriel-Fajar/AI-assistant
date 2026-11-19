// Topologi jaringan sekolah untuk Packet Tracer 8.2
// Menu: Extensions > Scripting > New PT Script Module, tempel seluruh isi file ini.
//
// RUN 1: biarkan STEP = 1, Start module. Membuat perangkat dan kabel.
//        Tunggu semua lampu link stabil (beberapa detik), lalu Stop module.
// RUN 2: ubah STEP = 2, Start module lagi. Mengisi konfigurasi VLAN, IP, routing, ACL.
// Jangan jalankan STEP 1 dua kali di file yang sama (perangkat jadi dobel).
var STEP = 1;

var lw, net;

function log(m) { try { print(m); } catch (e) {} }

// ---------- STEP 1: perangkat dan kabel ----------
// Nomor tipe perangkat berbeda antar versi, jadi dicoba satu per satu
// dan diverifikasi lewat getModel() sebelum dipakai.
function addDev(name, model, x, y, prefer) {
  var order = prefer.slice();
  for (var i = 0; i <= 30; i++) { if (order.indexOf(i) < 0) order.push(i); }
  for (var k = 0; k < order.length; k++) {
    var created = "";
    try { created = lw.addDevice(order[k], model, x, y); } catch (e) { created = ""; }
    if (created) {
      var d = net.getDevice(created);
      if (d && d.getModel() == model) {
        d.setName(name);
        try { d.skipBoot(); } catch (e2) {}
        log("OK  " + name + " (" + model + ", tipe " + order[k] + ")");
        return d;
      }
      try { lw.removeDevice(created); } catch (e3) {}
    }
  }
  log("GAGAL membuat " + name + " (" + model + ")");
  return null;
}

function link(a, pa, b, pb, cable) {
  var ok = false;
  try { ok = lw.createLink(a, pa, b, pb, cable); } catch (e) { ok = false; }
  log((ok ? "OK  " : "GAGAL ") + "link " + a + " " + pa + " <-> " + b + " " + pb);
}

function build() {
  // Ruang pusat
  addDev("Modem-ISP1", "2911", 200, 70, [0]);
  addDev("Modem-ISP2", "2911", 400, 70, [0]);
  addDev("Modem-ISP3", "2911", 650, 70, [0]);
  addDev("MikroTik", "3560-24PS", 400, 220, [16, 17, 1]);

  // Lantai bawah
  addDev("Switch-Bawah", "2960-24TT", 200, 380, [1]);
  addDev("PC-Siswa", "PC-PT", 60, 520, [8]);
  addDev("PC-Guru", "PC-PT", 160, 520, [8]);
  addDev("PC-Admin", "PC-PT", 260, 520, [8]);
  addDev("PC-Tamu", "PC-PT", 360, 520, [8]);

  // Lantai atas
  addDev("Ruijie-Atas", "2960-24TT", 650, 330, [1]);
  addDev("Switch-Atas", "2960-24TT", 650, 440, [1]);
  addDev("PC-Lab1", "PC-PT", 560, 570, [8]);
  addDev("PC-Lab2", "PC-PT", 660, 570, [8]);
  addDev("Laptop-GOR", "Laptop-PT", 760, 570, [18, 8]);

  // Modem ISP ke MikroTik
  link("Modem-ISP1", "GigabitEthernet0/0", "MikroTik", "FastEthernet0/1", "straight");
  link("Modem-ISP2", "GigabitEthernet0/0", "MikroTik", "FastEthernet0/2", "straight");
  link("Modem-ISP3", "GigabitEthernet0/0", "MikroTik", "FastEthernet0/3", "straight");
  // MikroTik ke lantai bawah dan lantai atas
  link("MikroTik", "FastEthernet0/4", "Switch-Bawah", "FastEthernet0/24", "cross");
  link("MikroTik", "FastEthernet0/5", "Ruijie-Atas", "FastEthernet0/24", "cross");
  link("Ruijie-Atas", "FastEthernet0/23", "Switch-Atas", "FastEthernet0/24", "cross");
  // Perangkat akhir
  link("Switch-Bawah", "FastEthernet0/1", "PC-Siswa", "FastEthernet0", "straight");
  link("Switch-Bawah", "FastEthernet0/2", "PC-Guru", "FastEthernet0", "straight");
  link("Switch-Bawah", "FastEthernet0/3", "PC-Admin", "FastEthernet0", "straight");
  link("Switch-Bawah", "FastEthernet0/4", "PC-Tamu", "FastEthernet0", "straight");
  link("Switch-Atas", "FastEthernet0/1", "PC-Lab1", "FastEthernet0", "straight");
  link("Switch-Atas", "FastEthernet0/2", "PC-Lab2", "FastEthernet0", "straight");
  link("Switch-Atas", "FastEthernet0/3", "Laptop-GOR", "FastEthernet0", "straight");
  log("STEP 1 selesai. Tunggu link stabil, lalu set STEP = 2 dan Run lagi.");
}

// ---------- STEP 2: konfigurasi ----------
function cli(name, cmds) {
  var d = net.getDevice(name);
  if (!d) { log("GAGAL: perangkat " + name + " tidak ditemukan"); return; }
  var c = d.getCommandLine();
  for (var i = 0; i < cmds.length; i++) { c.enterCommand(cmds[i]); }
  log("OK  konfigurasi " + name);
}

var VLANS = ["vlan 10", "name SISWA", "exit", "vlan 20", "name GURU", "exit",
             "vlan 30", "name ADMIN", "exit", "vlan 40", "name TAMU", "exit"];

function switchCfg(host, access, trunks) {
  var cmds = ["enable", "configure terminal", "hostname " + host, "no ip domain-lookup"].concat(VLANS);
  for (var p in access) {
    cmds.push("interface " + p, "switchport mode access", "switchport access vlan " + access[p], "no shutdown", "exit");
  }
  for (var i = 0; i < trunks.length; i++) {
    cmds.push("interface " + trunks[i], "switchport mode trunk", "no shutdown", "exit");
  }
  cmds.push("end", "copy running-config startup-config", "");
  cli(host, cmds);
}

function pcCfg(name, ip, gw) {
  var d = net.getDevice(name);
  if (!d) { log("GAGAL: perangkat " + name + " tidak ditemukan"); return; }
  var p = d.getPort("FastEthernet0");
  p.setIpSubnetMask(ip, "255.255.255.0");
  p.setDefaultGateway(gw);
  log("OK  IP " + name + " " + ip);
}

function modemCfg(host, wanIp, nextHop) {
  cli(host, ["enable", "configure terminal", "hostname " + host, "no ip domain-lookup",
    "interface GigabitEthernet0/0", "ip address " + wanIp + " 255.255.255.252", "no shutdown", "exit",
    "interface loopback0", "ip address 8.8.8.8 255.255.255.255", "exit",
    "ip route 10.10.0.0 255.255.0.0 " + nextHop,
    "end", "copy running-config startup-config", ""]);
}

function wanPort(n, ip) {
  return ["interface FastEthernet0/" + n, "no switchport", "ip address " + ip + " 255.255.255.252", "no shutdown", "exit"];
}

function svi(id, ip) {
  return ["interface vlan " + id, "ip address " + ip + " 255.255.255.0", "no shutdown", "exit"];
}

function trunk3560(port) {
  return ["interface " + port, "switchport trunk encapsulation dot1q", "switchport mode trunk", "no shutdown", "exit"];
}

function configure() {
  // Modem ISP (ISP3 hanya jalur IP publik, tanpa rute balik)
  modemCfg("Modem-ISP1", "192.168.1.1", "192.168.1.2");
  modemCfg("Modem-ISP2", "192.168.2.1", "192.168.2.2");
  cli("Modem-ISP3", ["enable", "configure terminal", "hostname Modem-ISP3",
    "interface GigabitEthernet0/0", "ip address 203.0.113.1 255.255.255.252", "no shutdown", "end",
    "copy running-config startup-config", ""]);

  // MikroTik (diwakili Layer 3 switch): VLAN, gateway, ACL tamu, dua default route
  var mk = ["enable", "configure terminal", "hostname MikroTik", "no ip domain-lookup", "ip routing"]
    .concat(VLANS)
    .concat(wanPort(1, "192.168.1.2"), wanPort(2, "192.168.2.2"), wanPort(3, "203.0.113.2"))
    .concat(trunk3560("FastEthernet0/4"), trunk3560("FastEthernet0/5"))
    .concat(["ip access-list extended TAMU-IN",
             "deny ip 10.10.40.0 0.0.0.255 10.10.0.0 0.0.31.255",
             "permit ip any any", "exit"])
    .concat(svi(10, "10.10.10.1"), svi(20, "10.10.20.1"), svi(30, "10.10.30.1"))
    .concat(svi(40, "10.10.40.1"))
    .concat(["interface vlan 40", "ip access-group TAMU-IN in", "exit",
             "ip route 0.0.0.0 0.0.0.0 192.168.1.1",
             "ip route 0.0.0.0 0.0.0.0 192.168.2.1",
             "end", "copy running-config startup-config", ""]);
  cli("MikroTik", mk);

  // Switch
  switchCfg("Switch-Bawah",
    { "FastEthernet0/1": 10, "FastEthernet0/2": 20, "FastEthernet0/3": 30, "FastEthernet0/4": 40 },
    ["FastEthernet0/24"]);
  switchCfg("Ruijie-Atas", {}, ["FastEthernet0/24", "FastEthernet0/23"]);
  switchCfg("Switch-Atas",
    { "FastEthernet0/1": 10, "FastEthernet0/2": 10, "FastEthernet0/3": 40 },
    ["FastEthernet0/24"]);

  // Perangkat akhir (Lab 1 dan Lab 2 mewakili 37 PC per lab)
  pcCfg("PC-Siswa", "10.10.10.11", "10.10.10.1");
  pcCfg("PC-Guru", "10.10.20.11", "10.10.20.1");
  pcCfg("PC-Admin", "10.10.30.11", "10.10.30.1");
  pcCfg("PC-Tamu", "10.10.40.11", "10.10.40.1");
  pcCfg("PC-Lab1", "10.10.10.21", "10.10.10.1");
  pcCfg("PC-Lab2", "10.10.10.22", "10.10.10.1");
  pcCfg("Laptop-GOR", "10.10.40.21", "10.10.40.1");
  log("STEP 2 selesai. Tes: ping 10.10.20.1 dari PC-Siswa, lalu ping 8.8.8.8.");
}

function main() {
  lw = ipc.appWindow().getActiveWorkspace().getLogicalWorkspace();
  net = ipc.network();
  if (STEP == 1) { build(); } else { configure(); }
}

function cleanUp() {}
