# Transkrip: pmj.m4a

_Model: medium (cuda) | Bahasa terdeteksi: id (p=1.00) | Durasi audio: 00:18:51 | Proses: 313s_

[00:00:00] Untuk di sekolah ini apakah ada ruangan yang khusus untuk kayak pusatnya gitu, untuk internet begitu?
[00:00:11] Ada.
[00:00:12] Itu kalau boleh tahu di ruang dimana?
[00:00:15] Di sana, di belakang tadi.
[00:00:16] Oh, yang tadi itu? Oh, oke.
[00:00:20] Ya, nanti bisa masuk.
[00:00:23] Oke, dari ruangan pusat itu apakah itu kayak kabelnya dirouting ke seluruh ruangan begitu untuk mencangkup router gitu atau bagaimana Pak?
[00:00:40] Ya, jadi kalau di situ kan ada dua modem ya.
[00:00:48] Dua modem kita fonding kemudian masuk ke router baru dibagi ke ruangan-ruangan.
[00:00:58] Oke, jadi hampir setiap ruangan ada router sendiri gitu Pak atau bagaimana?
[00:01:03] Router satu.
[00:01:04] Satu untuk?
[00:01:05] Satu router baru nanti dibagi ke ruangan-ruangan ke suite-suite.
[00:01:11] Oke.
[00:01:12] Ke suite, ke access point langsung, ke komputer, ada yang ke komputer langsung.
[00:01:25] Berarti di sekolah ini apakah hanya satu lantai begini atau ada yang tingkat Pak?
[00:01:30] Ada.
[00:01:31] Itu untuk menyalurkan internet dari lantai yang bawah ke atas itu apakah menggunakan kabel juga?
[00:01:39] Kabel.
[00:01:40] Kabel juga Pak, oke.
[00:01:45] Kalau boleh tahu Pak, untuk router, switch, modem begitu untuk mereknya apa boleh tahu Pak?
[00:01:56] Merek, kalau modem bawaan dari data ya, terus kalau routernya kita pakai mikrotik.
[00:02:09] Oh mikrotik.
[00:02:10] Kita pakai mikrotik, kemudian untuk ke access point kita ada dua, yang satu pakai
[00:02:23] ruji, satu, kan ada utara sama selatan gitu.
[00:02:27] Iya.
[00:02:28] Betul.
[00:02:29] Yang ini selatan, selatan itu ruji, kalau yang sana apa tau, kita merek sendiri diseluruh sana.
[00:02:38] Oke.
[00:02:39] Kemudian naik ke atas, naik ke atas ada ruji lagi, ada ruji lagi, tapi hampir mirip
[00:02:51] seperti si mikrotik, jadi menitable, tapi lebih mudah aturannya daripada mikrotik, hampir
[00:03:06] mirip.
[00:03:07] Ada load balancing, ada virtual land, ada juga bandwidth limiter, hampir mirip.
[00:03:22] Itu yang di dashboardnya ya Pak, untuk menyet-nyet semua.
[00:03:26] Kita selain mikrotik, pakai ruji.
[00:03:30] Ruji.
[00:03:31] Iya.
[00:03:32] Itu yang kita lakukan, jadi ada dua management, jadi kan tadi ada dua modem saya bilang.
[00:03:43] Iya.
[00:03:44] Dua modem itu satu modemnya 300, kita gabung, kita bonding jadi satu, satu 600.
[00:03:51] Oh, anu megabit ya megabit?
[00:03:55] Kita bonding jadi 600, 600 baru dipecah-pecah.
[00:04:00] Kalau yang ruji nya saya ambilnya tidak 300 semua, tapi saya ambil cuman 50, 50 dari modem
[00:04:09] satu, 50 modem dua, gabungnya 100.
[00:04:13] Karena itu untuk atas sana.
[00:04:15] Oh, yang lantai atas.
[00:04:17] Lantai atas, lantai atas.
[00:04:19] Iya?
[00:04:20] Iya.
[00:04:21] Karena sedikit, yang paling banyak ya bawah ini.
[00:04:25] Bawah ini.
[00:04:27] Iya, makanya pakai virtual land itu.
[00:04:50] Oh, itu yang buat mengkonsegrasinya itu.
[00:04:53] Virtual land itu fungsinya untuk mecah-mecah lokal, ada lokal untuk nilai, ada lokal
[00:05:01] lagi untuk internet sendiri, internet guru sendiri, internet siswa sendiri, ada juga
[00:05:07] internet untuk admin.
[00:05:09] Nah, itu kita becah-becah.
[00:05:11] Kalau enggak, rebutan.
[00:05:13] Iya, betul, betul.
[00:05:15] Jadi, untuk setiap siswa, guru, terus admin itu berarti ada masing-masingnya?
[00:05:22] Iya.
[00:05:23] Nah, itu tuh mereka koneknya langsung kayak konek gitu kan?
[00:05:27] Ada merifikasi konek apa gitu?
[00:05:31] Memanfaatkan Sandi gitu Pak, Sandi yang khusus guru waktu itu kan?
[00:05:34] Itu khusus tamu.
[00:05:35] Oh, tamu.
[00:05:36] Kalau khusus tamu seperti itu.
[00:05:38] Kita, iya itu sendiri, tapi kalau siswa enggak.
[00:05:43] Siswa langsung, dia cuma masukin password sekali, abis itu dipakai.
[00:05:52] Tapi ada waktu, dia dibatasi waktu, 90 menit dia lepas, lock-in lagi.
[00:06:03] Itu mengatasi agar tidak di monopoli oleh dia.
[00:06:14] Jadi, karena kan 600, murid kita juga 600.
[00:06:23] Ada jadinya di abis.
[00:06:27] Maka, saya buat seperti itu agar yang lainnya semua kebahagiaan.
[00:06:32] Jadi, tidak semua siswa itu secara bareng-bareng mengakses semua.
[00:06:39] Nggak mungkin.
[00:06:40] Karena ada limit tadi itu ya Pak?
[00:06:42] Iya.
[00:06:47] Ya, saya batasi.
[00:06:50] Kalau guru, cuma pembatasannya bandwidth saja.
[00:06:55] Oke.
[00:06:56] Kalau siswa dua, bandwidth sama waktu.
[00:06:59] Waktu.
[00:07:01] Kalau guru, bandwidth top.
[00:07:03] Kalau untuk perkiraan, kan untuk anak di sini sekitar 600 ya Pak.
[00:07:11] Terus bandwidth guru ya, guru terus begitu.
[00:07:16] Ada perkiraan nggak ya Pak?
[00:07:18] Untuk sehari-hari itu kira-kira berapa perangkat gitu Pak?
[00:07:21] Atau apakah di sini juga ada lab gitu Pak?
[00:07:23] Ada.
[00:07:24] Lab computer gitu Pak?
[00:07:25] Ada.
[00:07:26] Maka di atas itu.
[00:07:27] Oh, yang di atas itu?
[00:07:28] Iya.
[00:07:31] Kalau di sana, saya pakai Rui Ji itu, selain untuk kelas, saya pakai gur juga.
[00:07:41] Oh, gur.
[00:07:43] Kalau gur itu, sifatnya umum.
[00:07:45] Kita pakainya voucher.
[00:07:50] Jadi, kalau ada yang mau beli ya.
[00:07:54] Ya, gitu sistemnya voucher.
[00:07:58] Voucher satu jam.
[00:08:03] 10.000-an.
[00:08:04] 10.020 Mbps.
[00:08:09] Mbps satu jam.
[00:08:14] Itu di gur saja maksudnya?
[00:08:15] Iya.
[00:08:18] Di sini labnya ada berapa Pak?
[00:08:20] Labnya kalau lab computer sendiri 2.
[00:08:25] Kapasitas 37.
[00:08:28] Berarti 37 perwangan ya?
[00:08:30] Iya.
[00:08:40] Iya, masih 500.
[00:08:45] Kalau gur itu tidak ada sih.
[00:08:46] Tidak ada.
[00:08:47] Gur paling 50.
[00:08:48] Tidak sampai lah.
[00:08:54] Sekitar 700.
[00:08:56] Sebetulnya selain 2 itu ada 1.
[00:09:00] 1 lagi ISP.
[00:09:02] Tapi itu tidak pernah saya undai-undai.
[00:09:05] Karena itu di kepas sekolah.
[00:09:08] Saya tidak mau ngambil dari situ.
[00:09:11] Oh, maaf, 4.
[00:09:12] Yang satu ada IP publik saja.
[00:09:15] Tapi kecil.
[00:09:16] Bandwidthnya kecil.
[00:09:17] Makannya tidak bonding.
[00:09:20] Yang penting saya dapat IP publik.
[00:09:32] Tadi yang untuk mengkonfigurasi semua itu pakai yang apa tadi Pak namanya?
[00:09:38] Lanyard.
[00:09:39] Itu yang buat mengatur semua internet di sekolah.
[00:09:43] Untuk bagi-bagi lokal karena tergabung banyak internet yang free oleh anak-anak.
[00:09:54] Bisa dia.
[00:09:59] Ya, filter.
[00:10:05] Filter tergabung.
[00:10:06] Tergabung.
[00:10:07] Tergabung.
[00:10:08] Tergabung.
[00:10:09] Tergabung.
[00:10:10] Tergabung.
[00:10:11] Tergabung.
[00:10:12] Tergabung.
[00:10:23] Ya, filter.
[00:10:24] Ya.
[00:10:25] Filter tetap.
[00:10:26] Filter tetap.
[00:10:27] Hanya saja saya selalu menekankan.
[00:10:30] Sebagus-bagusnya filter ya.
[00:10:32] Tetap paling bagus ya filter dari mereka sendiri.
[00:10:35] Iya, betul.
[00:10:36] Kita stop di sini dia lari ke sana.
[00:10:38] Kita stop di sana lari ke sini itu mesti.
[00:10:41] Nggak mungkin.
[00:10:42] Iya.
[00:10:43] Filter itu.
[00:10:48] Macam-macam, Pak.
[00:10:49] Mau...
[00:10:50] Mau lari dari game.
[00:10:52] Oh, aplikasi juga, Pak.
[00:10:54] Iya, aplikasi juga.
[00:10:55] Kalau di mikrotik kan lebih bebas.
[00:10:57] Iya, benar.
[00:10:58] Terus website.
[00:11:01] Aplikasi tadi.
[00:11:05] Kayak misalnya sih terus judul, fotografi, begitu-begitu ya, Pak.
[00:11:08] Dan gitu.
[00:11:09] Tapi ya tetap aja bisa lolos.
[00:11:12] Iya.
[00:11:13] Mereka kan ganti-ganti IP kan bisa.
[00:11:16] Bisa.
[00:11:17] Ditutup IP di sini, buka IP di sana kan gitu terus.
[00:11:22] Ya.
[00:11:23] Iya, tapi ya itu.
[00:11:25] Saya selalu menekankan.
[00:11:27] Filter terbagi tetap dari.
[00:11:29] Setuanya sendiri ya.
[00:11:31] Betul, betul, betul.
[00:11:33] Untuk...
[00:11:36] Ano, Pak.
[00:11:37] Tadi kan lo bilang ya ada pembatesan bandwidth ya, betul, Pak.
[00:11:42] Itu pembatesan bandwidth.
[00:11:45] Buat guru ada.
[00:11:47] Buat siswa juga ada.
[00:11:49] Buat tamu.
[00:11:50] Nah, itu untuk pembatesan itu apakah hanya per sejumlah IP.
[00:11:59] Atau itu kayak per access point, gitu, Pak.
[00:12:02] Per jumlah IP.
[00:12:03] Jadi per person.
[00:12:05] Jadi rata.
[00:12:07] Berarti misalnya ada 100 siswa yang connect, gitu.
[00:12:12] Berarti semua siswa itu mendapatkan jumlah yang sama, gitu ya, Pak.
[00:12:17] Berarti per IP, betul ya.
[00:12:19] Kecuali guru.
[00:12:23] Kalau guru nggak seperti itu.
[00:12:24] Kalau guru dia sistemnya bisa maksimum ya.
[00:12:33] Maksudnya, misalnya nih.
[00:12:37] Misalnya yang online sekarang hanya 2 orang.
[00:12:43] Misalnya dia saya berikan 100.
[00:12:45] Ya 100 bagi 2.
[00:12:48] Nanti kalau...
[00:12:50] Berarti itu nggak per IP kalau itu.
[00:12:52] Berarti sesuai berapa?
[00:12:53] Terus dibagi begitu ya, Pak.
[00:12:55] Itu untuk guru.
[00:12:57] Kalau guru bukan per IP.
[00:12:59] Tapi per pengguna.
[00:13:01] Dibagi bandwidthnya per pengguna, gitu ya, Pak.
[00:13:04] Baik.
[00:13:06] Kalau siswa harus patok.
[00:13:11] Misalnya banyak.
[00:13:13] Hmm.
[00:13:19] Hmm.
[00:13:23] Saya...
[00:13:26] Kepala Sintases.
[00:13:28] Terus...
[00:13:29] Ada...
[00:13:31] Wakel saya, teman berdua.
[00:13:34] Ada staf satu.
[00:13:35] Jadi kepala satu, staf satu.
[00:13:42] Belum dibuat.
[00:13:44] Apa, apa?
[00:13:46] Oh, Pak...
[00:13:48] Pak Dini.
[00:13:51] Oh.
[00:13:55] Oh, nanti di TWAF.
[00:14:04] Oke.
[00:14:06] Untuk jaringan pasti nggak ini apa.
[00:14:09] Pasti kadang-kadang juga bermasalah pasti ya.
[00:14:12] Nah, biasanya itu kalau bermasalah itu...
[00:14:15] Masalahnya di bagian apa, Pak?
[00:14:17] Hardware.
[00:14:18] Hardware berarti?
[00:14:19] Overload.
[00:14:20] Berbandingkan IP?
[00:14:22] Ya, overload itu...
[00:14:24] Kemudian...
[00:14:25] Perangkat yang sudah tua.
[00:14:27] Hmm.
[00:14:29] Tapi kemarin ya tau-tau...
[00:14:30] Satu pot mati padahal itu...
[00:14:34] Sumber.
[00:14:35] Port yang penting ya, Pak.
[00:14:36] Hah.
[00:14:37] Semua mati semburan.
[00:14:40] Tapi...
[00:14:42] Tapi ya...
[00:14:44] Kalau di modemnya...
[00:14:47] Kalau di kita sih gampang langsung diganti.
[00:14:50] Tapi yang susah kalau...
[00:14:52] Dari modemnya si ISP ya.
[00:14:55] Agak lama numpunya.
[00:14:57] Hmm, kamu izin juga ya, Pak?
[00:14:59] Oh.
[00:15:01] Berarti...
[00:15:02] Ya, paling...
[00:15:04] Maksimum enam jam lah numpuh.
[00:15:07] Ya, cepat lah itu waktu masuknya, Pak.
[00:15:09] Secepat-cepat itu, Pak.
[00:15:11] Berarti lebih...
[00:15:12] Kalau masalah itu lebih Hardware-nya ya, Pak.
[00:15:14] Jadi kalau jaringannya sebenarnya enggak ada masalahnya.
[00:15:19] Kalau...
[00:15:21] Kalau...
[00:15:23] Di luar Hardware itu...
[00:15:25] Biasanya dia muncul...
[00:15:27] Setelah...
[00:15:29] Pembuatan topologi-topologi baru, Pak.
[00:15:31] Itu langsung muncul.
[00:15:33] Masalahnya itu?
[00:15:34] Iya, Pak.
[00:15:35] Tapi kalau sudah jalan, jarang.
[00:15:37] Benar-benar.
[00:15:38] Maksimum masalah Hardware.
[00:15:40] Hmm, oke.
[00:15:43] Berarti mendukung atau enggak itu Hardware-nya.
[00:15:46] Baik-baik.
[00:15:48] Sudah?
[00:15:50] Sudah.
[00:15:52] Untuk pertanyaannya ini cukup, Pak.
[00:15:54] Oke.
[00:16:02] Ya, jadi kita...
[00:16:04] Ada aplikasi namanya Paket Tracer itu, Pak.
[00:16:06] Nah, itu kita disuruh buat...
[00:16:08] Fisikalnya.
[00:16:10] Jadi kita disuruh nge-layout sekolahnya bagaimana.
[00:16:12] Terus kita...
[00:16:14] Disuruh menjaringkan...
[00:16:16] Jaringan itu dari mana, yang mana gitu.
[00:16:18] Keruangan-keruangan begitu, Pak.
[00:16:20] Iya.
[00:16:24] Ya...
[00:16:26] Kalau untuk topologi...
[00:16:30] Yang jadi sumber, kan...
[00:16:32] Ini anggunnya internet, ya?
[00:16:34] Ya, begitu.
[00:16:36] Sumber itu tetap...
[00:16:38] Seperti saya bilang tadi ada dua sumber.
[00:16:40] Dua sumber semuanya dibonding.
[00:16:44] Berarti 300-300, 600.
[00:16:48] 600-600 masuk ke Mikrotik.
[00:16:52] Berarti 300-300.
[00:16:54] 600 masuk sana semua.
[00:16:56] Tapi saya split 50...
[00:16:58] Itu untuk masuk ke Rui Ji.
[00:17:00] Rui Ji.
[00:17:02] Yang ruang atas itu, ya?
[00:17:04] Jadi 50 sampai sana, 50 sampai sini.
[00:17:08] Itu...
[00:17:10] Itu yang jadi pokoknya.
[00:17:12] Itu yang jadi pokoknya.
[00:17:14] Jadi Mikrotik boleh kalian gambarkan...
[00:17:16] Di lantai bawah.
[00:17:18] Sedangkan Rui Ji-nya...
[00:17:20] Di atas.
[00:17:22] Tidak lah.
[00:17:28] Oke.
[00:17:30] Di bawah, kalian asumsikan...
[00:17:32] Itu ya 600 klien.
[00:17:34] Nah.
[00:17:36] Terus di atas...
[00:17:38] Kalian asumsikan ya 200.
[00:17:42] Itu minus wih hasilnya.
[00:17:46] Iya.
[00:17:48] MPS-nya kurang.
[00:17:50] Tapi ya itu saya...
[00:17:52] Manage private gitu.
[00:17:54] Makanya dikasih limit tadi kan, Pak?
[00:17:56] Ada limit itu.
[00:17:58] Ada lagi minute. Limit jam.
[00:18:00] Limit jam itu...
[00:18:02] Saya pakai digore.
[00:18:04] Gore itu kan...
[00:18:06] Aktif setelah...
[00:18:08] Pembelajaran.
[00:18:10] Berarti yang lain saya tutup...
[00:18:12] Ganti pindah ke sana.
[00:18:14] Nanti...
[00:18:16] Pas pagi...
[00:18:18] Di sana gantian siapa tutup...
[00:18:20] Siapa pindah ke sana.
[00:18:24] Berarti jam pulang.
[00:18:26] Jam pulang gitu, Pak.
[00:18:28] Kecuali hari libur.
[00:18:30] Itu semua.
[00:18:34] Ada layanan online sih?
[00:18:36] Mungkin cukup ya.
[00:18:38] Tapi untuk salah sepertinya cukup.
[00:18:40] Mungkin kalau ada yang kurang...
[00:18:42] Kami akan bertanya sekarang.
[00:18:44] Nomernya sudah ada?
[00:18:46] Belum, Pak.
[00:18:50] Berarti recordnya sudah ya?
