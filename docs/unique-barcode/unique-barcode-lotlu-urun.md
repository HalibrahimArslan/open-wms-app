# Mal Kabul Unique Barkod Süreci Lot'lu Ürün

- Mal kabul sürecinde unique-barcode yapısında artık "stokBirimi" kolonuna göre ürün barkod yazdırma senaryoları değişmektedir.

- Eski yapımızda("ADET","MT2","MTÜL,"KİLOGRAM","MT") stokBiriminden dönen bu stokBirimi çeşitliliğine göre barkod olusturup sipariş toplama senaryoları değişmekteydi.

- Lot'lu bir ürün için artık hangi tabloda hani kolonda bilgi güncellencek bilmiyorum ama iş akışını çıkartıyorum

- Mal kabul ekranında sipariş detayları içerisinde eğer daha önceden bir ürün lot'lu olarak kaydedildiyse tasarımı kart şeklinde olucak, yan yana ("stok kodu","stok adı", "uniqueBarcode") bilgileri gösterilecek ve kartın en altında yazdır buttonu olucak bu da tekli barkod yazdırmak için.

- Mal kabul ekranında eğer eklemek istenilen lot'lu ürünler olabilir bunun için bir ürün ekle buttonu olucak, ürün ekle buttonuna tıkladığımız da bir pop-up açılacak ve burada ("stok kodu","stok adi") bu iki alana göre arama yapabilecek, bu aramadan gelen ürünün ana barkodundan uniqueBarcode oluşturulacak.

- Yeni bir lot'lu ürün oluştururken açılan pop-up da, siparişin içerisinde daha önceden oluşmul listelenmiş kart tasarımdaki alanlar gösterilecek ek olarak yeni oluşcak barkod'da gösterilecek ve son olarak onayla buttonu olucak buna tıklayınca eğer zaten o siparişin içeriisnde böyle bir ürün varsa listeye eklicek.

- Lot'lu ürünler oluşturulurken barkod yapısında sonunda eskiden index numaramız oluyordu backendden bu şekilde dönüyordu ama burda öyle olmucak sonunda 4 adet 0 olucak "0000"

- Kullanıcı her şartta aynı ürün için birden fazla barkod yazdırabilmelidir. print edebilmelidir yani.

- Siparişin içerisindeki lot'lu ürünleri toplamaya geldiği zaman uniqueBarcode'unu okuttuğu zaman bizim miktar alanı açılmalıdır ve miktar alınmalıdır. oluşmuş uniqueBarcode için birden fazla miktarda sipariş toplayabilmelidir. zaten en temel bu ürün tipini yapmamızdaki amaç da bu.

- miktar alanına 0 girmemeli, harf özel değer girmemeli, hatta sana şöyle söyliyeyim orderQuantityInput diye bir component var yüksek ihtimal onu çalıştırırsın.

- Sipariş toplama için girilen miktar da oluşmuş uniqueBarcode için teslimMiktarı güncellemeli.

## Lotlu Ürün Senaryosu Sorular

- Bir ürünün lot'lu olup olmadığını hangi api dönüşü hangi kolondan anlayacağız ?

- Lot'lu ürün ürün ekleme mantığı nedir ?

- Lot'lu eklenen sipariş içindeki ürün başka siparişlerde lot'lu olarak mı kalıcak ?

- Lot'lu ürün ekle kısmı mal kabul ekranında mı olucak yoksa başka özel bir ekran mı isteniyor ?

- Lot'lu eklenen ürünler de kullanıcı istediği kadar miktar girebilecek mi ?