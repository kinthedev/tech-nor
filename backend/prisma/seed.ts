import fs from "fs"
import path from "path"
import { prisma } from "../lib/prisma"

interface ProductSeedItem {
	title: string
	category: string
	brand: string
	price: number
	rating: number
	description: string
	stock: number
	discountPercentage: number
}

// Bảng dữ liệu chi tiết cho từng ảnh cụ thể
const detailedProductMap: Record<string, Partial<ProductSeedItem>> = {
	"10056304-dien-thoai-iphone-plus.webp": {
		title: "iPhone 15 Plus 128GB Chính Hãng VN/A",
		category: "smartphones",
		brand: "Apple",
		price: 899.99,
		rating: 4.9,
		description:
			"iPhone 15 Plus nổi bật với màn hình Super Retina XDR 6.7 inch kết hợp Dynamic Island tiện ích, camera chính 48MP cho hình ảnh siêu sắc nét và thời lượng pin dẫn đầu phân khúc.",
		stock: 45,
		discountPercentage: 10,
	},
	"7.jpg": {
		title: "iPad Pro 11-inch M2 Liquid Retina 128GB",
		category: "tablets",
		brand: "Apple",
		price: 799.0,
		rating: 4.8,
		description:
			"iPad Pro 11-inch trang bị vi xử lý Apple M2 đỉnh cao sức mạnh, màn hình Liquid Retina công nghệ ProMotion 120Hz, hỗ trợ Apple Pencil 2 và Magic Keyboard biến tablet thành cỗ máy làm việc thực thụ.",
		stock: 30,
		discountPercentage: 5,
	},
	"samsung-galaxy-s25-edge-blue-thumb-600x600.jpg": {
		title: "Samsung Galaxy S25 Edge Blue 256GB 5G",
		category: "smartphones",
		brand: "Samsung",
		price: 999.0,
		rating: 4.8,
		description:
			"Samsung Galaxy S25 Edge mang phong cách viền cong quyến rũ, chip xử lý Snapdragon thế hệ mới nhất cùng hệ thống Galaxy AI đột phá hỗ trợ dịch thuật và chỉnh ảnh thời gian thực.",
		stock: 50,
		discountPercentage: 12,
	},
	"shopping.webp": {
		title: "Samsung Galaxy S24 Ultra 5G 256GB Titanium",
		category: "smartphones",
		brand: "Samsung",
		price: 1199.0,
		rating: 4.9,
		description:
			"Đỉnh cao công nghệ di động với khung viền Titanium chuẩn hàng không vũ trụ, bút S-Pen tích hợp, cảm biến 200MP zoom quang học 100x và màn hình phẳng Dynamic AMOLED 2X chống chói vượt trội.",
		stock: 35,
		discountPercentage: 8,
	},
	"google_0.jpg": {
		title: "Bàn phím cơ Gaming RGB Eluktronics Fullsize",
		category: "accessories",
		brand: "Eluktronics",
		price: 89.99,
		rating: 4.6,
		description:
			"Bàn phím cơ gaming với switch cơ học độ phản hồi xúc giác cực nhạy, hệ thống đèn nền RGB 16.8 triệu màu tùy chỉnh và tấm nền kim loại chắc chắn chuẩn game thủ.",
		stock: 60,
		discountPercentage: 15,
	},
	"google_00.jpg": {
		title: "Pin sạc dự phòng đa năng 20000mAh tích hợp cáp sạc",
		category: "accessories",
		brand: "Baseus",
		price: 39.99,
		rating: 4.7,
		description:
			"Pin sạc dự phòng tiện lợi tích hợp sẵn dây cáp Type-C, Lightning và màn hình LED hiển thị dung lượng chính xác, công suất sạc nhanh 22.5W an toàn cho mọi thiết bị.",
		stock: 90,
		discountPercentage: 20,
	},
	"google_0000.jpg": {
		title: "Đồng hồ thông minh định vị trẻ em 4G LTE Kính cường lực",
		category: "smartwatches",
		brand: "Wonlex",
		price: 59.99,
		rating: 4.5,
		description:
			"Đồng hồ định vị trẻ em hỗ trợ sim 4G/LTE, gọi video call HD, nút gọi khẩn cấp SOS và định vị chính xác vị trí thời gian thực, pin sử dụng liên tục lên đến 2.5 ngày.",
		stock: 75,
		discountPercentage: 10,
	},
	"google_0002.jpg": {
		title: "Đồng hồ thông minh Smartwatch AMOLED nghe gọi Bluetooth",
		category: "smartwatches",
		brand: "Haylou",
		price: 49.99,
		rating: 4.6,
		description:
			"Smartwatch mặt vuông thời thượng trang bị màn hình AMOLED siêu sáng, đàm thoại Bluetooth rõ ràng, tích hợp hơn 100 chế độ thể thao và cảm biến đo sức khỏe 24/7.",
		stock: 80,
		discountPercentage: 15,
	},
	"google_0002.webp": {
		title: "Đồng hồ thông minh theo dõi sức khỏe & thể thao đa năng",
		category: "smartwatches",
		brand: "Amazfit",
		price: 69.99,
		rating: 4.5,
		description:
			"Màn hình cảm ứng sắc nét, thiết kế dây đeo silicon mềm mại êm ái, chống nước chuẩn 5ATM thích hợp bơi lội và luyện tập ngoài trời.",
		stock: 65,
		discountPercentage: 10,
	},
	"google_000222.jpg": {
		title: "Đồng hồ định vị học sinh GPS/Wifi chống nước chuẩn IP67",
		category: "smartwatches",
		brand: "Wonlex",
		price: 54.99,
		rating: 4.4,
		description:
			"Bảo vệ an toàn cho con yêu với khả năng thiết lập vùng an toàn, cảnh báo rời khu vực, nghe lén âm thanh môi trường và thời lượng pin bền bỉ.",
		stock: 70,
		discountPercentage: 12,
	},
	"google_0003.jpg": {
		title: "Đồng hồ thông minh Sport Loop Pin 7 Ngày Có Nghe Gọi",
		category: "smartwatches",
		brand: "Xiaomi",
		price: 79.99,
		rating: 4.7,
		description:
			"Dây đeo vải thể thao co giãn thoáng khí, thời lượng pin ấn tượng lên đến 7 ngày chỉ với 1.25 giờ sạc nhanh, hỗ trợ nhận cuộc gọi và đọc tin nhắn tức thì.",
		stock: 85,
		discountPercentage: 15,
	},
	"google_0004.jpg": {
		title: "Đồng hồ thông minh Smartwatch Ultra Sport Edition",
		category: "smartwatches",
		brand: "Amazfit",
		price: 89.0,
		rating: 4.6,
		description:
			"Khung viền hợp kim siêu bền, màn hình lớn sắc nét, đo chỉ số oxy trong máu SpO2, theo dõi giấc ngủ REM và thông báo nhịp tim bất thường.",
		stock: 60,
		discountPercentage: 10,
	},
	"google_000444.jpg": {
		title: "Đồng hồ thông minh trẻ em Pro Video Call 4G",
		category: "smartwatches",
		brand: "Wonlex",
		price: 62.0,
		rating: 4.5,
		description:
			"Đồng hồ thông minh cao cấp dành cho trẻ em với camera trước độ nét cao, định vị đa tầng GPS/Wifi/LBS giúp cha mẹ luôn an tâm về con cái.",
		stock: 55,
		discountPercentage: 5,
	},
	"google_0006.jpg": {
		title: "Đồng hồ thể thao Smartwatch Kháng nước IP68 Dây Silicon",
		category: "smartwatches",
		brand: "Huawei",
		price: 95.0,
		rating: 4.7,
		description:
			"Thiết kế thể thao năng động, trang bị cảm biến TruSeen theo dõi chỉ số thể chất chuẩn xác, kết nối mượt mà với cả hệ điều hành Android và iOS.",
		stock: 68,
		discountPercentage: 18,
	},
	"google_0007.jpg": {
		title: "Robot hút bụi lau nhà thông minh Kärcher RCV 3 Tự động",
		category: "smart-home",
		brand: "Karcher",
		price: 459.0,
		rating: 4.8,
		description:
			"Thương hiệu đến từ Đức với hệ thống dẫn đường laser LiDAR quét bản đồ chính xác, lực hút mạnh mẽ dọn sạch lông thú nuôi và bụi mịn trên mọi sàn nhà.",
		stock: 25,
		discountPercentage: 10,
	},
	"google_00077.jpg": {
		title: "Robot hút bụi lau sàn Kärcher RCV 5 Trạm sạc đa năng",
		category: "smart-home",
		brand: "Karcher",
		price: 599.0,
		rating: 4.9,
		description:
			"Phiên bản nâng cấp với cảm biến kép AI tránh vật cản thông minh, tự động nâng khăn lau khi gặp thảm và hỗ trợ điều khiển qua ứng dụng Kärcher Home.",
		stock: 20,
		discountPercentage: 15,
	},
	"google_0008.jpg": {
		title: "Điện thoại Xiaomi POCO F6 5G 256GB Snapdragon 8s Gen 3",
		category: "smartphones",
		brand: "Xiaomi",
		price: 379.0,
		rating: 4.8,
		description:
			"Quái vật hiệu năng trong tầm giá với vi xử lý Snapdragon 8s Gen 3, màn hình AMOLED 1.5K 120Hz siêu sáng và sạc nhanh Turbo 90W nạp đầy pin chỉ trong 35 phút.",
		stock: 90,
		discountPercentage: 12,
	},
	"google_0008.webp": {
		title: "Xiaomi POCO F6 Pro 5G 512GB Gaming Phone",
		category: "smartphones",
		brand: "Xiaomi",
		price: 469.0,
		rating: 4.8,
		description:
			"Màn hình WQHD+ 120Hz rực rỡ, tản nhiệt LiquidCool 4.0 mát mẻ duy trì hiệu năng chiến game liên tục cùng camera chống rung OIS 50MP.",
		stock: 65,
		discountPercentage: 10,
	},
	"google_000888.webp": {
		title: "Xiaomi POCO X6 Pro 5G 256GB Viền Siêu Mỏng",
		category: "smartphones",
		brand: "Xiaomi",
		price: 329.0,
		rating: 4.7,
		description:
			"Trang bị chip Dimensity 8300-Ultra mạnh mẽ hàng đầu, hệ điều hành Xiaomi HyperOS mượt mà và màn hình Flow AMOLED chuẩn màu điện ảnh.",
		stock: 80,
		discountPercentage: 15,
	},
	"google_0009.jpg": {
		title: "Robot hút bụi lau nhà Shark Matrix 2-in-1 Tự đổ rác",
		category: "smart-home",
		brand: "Shark",
		price: 549.0,
		rating: 4.8,
		description:
			"Hệ thống làm sạch Shark Matrix Clean làm sạch chuyên sâu theo lưới ma trận, dock tự động hút rác có màng lọc HEPA giữ bụi bẩn suốt 60 ngày không cần chạm tay.",
		stock: 22,
		discountPercentage: 15,
	},
	"google_0010.jpg": {
		title: "iPhone 14 Pro Max 256GB Deep Purple Sang Trọng",
		category: "smartphones",
		brand: "Apple",
		price: 1049.0,
		rating: 4.9,
		description:
			"Sở hữu màu sắc Deep Purple huyền thoại, màn hình Dynamic Island 6.7 inch Always-On Display, camera Pro 48MP và vi xử lý Apple A16 Bionic vượt trội.",
		stock: 40,
		discountPercentage: 5,
	},
	"google_0011.jpg": {
		title: "Pin sạc dự phòng Ugreen 55W 10000mAh Tích hợp cáp USB-C",
		category: "accessories",
		brand: "Ugreen",
		price: 45.0,
		rating: 4.8,
		description:
			"Công nghệ sạc nhanh PD 55W sạc được cho cả laptop và điện thoại, màn hình hiển thị LED thông minh, thiết kế nhỏ gọn bo tròn dễ dàng mang theo.",
		stock: 110,
		discountPercentage: 20,
	},
	"google_0014.jpg": {
		title: "Chuột Gaming không dây siêu nhẹ tổ ong Honeycomb 2.4G",
		category: "accessories",
		brand: "Attack Shark",
		price: 39.99,
		rating: 4.6,
		description:
			"Trọng lượng siêu nhẹ chỉ 59g với thiết kế lỗ tổ ong tản nhiệt, cảm biến quang học 16000 DPI điều chỉnh linh hoạt và switch bấm 50 triệu lượt nhấn.",
		stock: 95,
		discountPercentage: 15,
	},
	"google_0016.jpg": {
		title: "Điện thoại OPPO Reno 12 F 5G 256GB Chuyên Gia Chân Dung AI",
		category: "smartphones",
		brand: "Oppo",
		price: 349.0,
		rating: 4.7,
		description:
			"Thiết kế ánh sao thời thượng với đèn viền halo sáng rực rỡ, tính năng AI Eraser xoá vật thể thông minh cùng camera chân dung chuyên nghiệp bắt trọn cảm xúc.",
		stock: 75,
		discountPercentage: 10,
	},
	"google_002.jpg": {
		title: "Đồng hồ thông minh Smartwatch AMOLED Chống Nước Thể Thao",
		category: "smartwatches",
		brand: "Amazfit",
		price: 59.99,
		rating: 4.5,
		description:
			"Đồng hồ thông minh màn hình AMOLED sắc nét, cảm biến đo nhịp tim và nồng độ oxy liên tục, thiết kế mỏng nhẹ tinh tế phù hợp cho cả nam và nữ.",
		stock: 85,
		discountPercentage: 12,
	},
	"google_0024.jpg": {
		title: "Điện thoại thông minh Vivo Y100 5G Thiết kế thời thượng",
		category: "smartphones",
		brand: "Vivo",
		price: 279.0,
		rating: 4.6,
		description:
			"Mặt lưng đổi màu độc đáo, loa kép âm thanh vòm sống động, sạc siêu tốc FlashCharge 80W và màn hình AMOLED tần số quét 120Hz.",
		stock: 60,
		discountPercentage: 14,
	},
	"google_0026.jpg": {
		title: "Điện thoại thông minh Realme 12 Pro+ 5G Camera Tiềm Vọng",
		category: "smartphones",
		brand: "Realme",
		price: 389.0,
		rating: 4.7,
		description:
			"Thiết kế lấy cảm hứng từ đồng hồ cao cấp sang trọng, camera tiềm vọng tele 64MP zoom xa rõ nét và hiệu năng mạnh mẽ cân mọi tác vụ hàng ngày.",
		stock: 50,
		discountPercentage: 10,
	},
	"google_0028.jpg": {
		title: "Đồng hồ định vị trẻ em GPS 4G Màu Hồng Kính Cường Lực",
		category: "smartwatches",
		brand: "Wonlex",
		price: 55.0,
		rating: 4.6,
		description:
			"Màu hồng pastel xinh xắn cho bé gái, hỗ trợ video call 4G sắc nét, thời lượng pin 4 ngày, mặt kính cường lực chống trầy và tính năng định vị an toàn.",
		stock: 80,
		discountPercentage: 10,
	},
	"google_0029.jpg": {
		title: "Đồng hồ định vị thông minh GPS trẻ em Màu Xanh Năng Động",
		category: "smartwatches",
		brand: "Wonlex",
		price: 55.0,
		rating: 4.6,
		description:
			"Phiên bản xanh dương cá tính, định vị chính xác vị trí bảo vệ trẻ, nút bấm khẩn cấp kết nối trực tiếp đến cha mẹ chỉ trong 1 chạm.",
		stock: 75,
		discountPercentage: 10,
	},
	"google_0036.jpg": {
		title: "Chuột Gaming không dây Logitech G304 Lightspeed Đen",
		category: "accessories",
		brand: "Logitech",
		price: 49.99,
		rating: 4.9,
		description:
			"Chuột gaming không dây quốc dân với cảm biến HERO 12.000 DPI siêu chuẩn xác, công nghệ Lightspeed không độ trễ 1ms và pin dùng đến 250 giờ liên tục.",
		stock: 120,
		discountPercentage: 15,
	},
	"google_0037.jpg": {
		title: "Chuột không dây công thái học Delux M618 Đứng Chống Mỏi",
		category: "accessories",
		brand: "Delux",
		price: 38.0,
		rating: 4.5,
		description:
			"Góc nghiêng 57 độ tự nhiên giúp bàn tay thả lỏng tối đa, giảm đau mỏi cổ tay hiệu quả cho dân văn phòng và lập trình viên làm việc nhiều giờ.",
		stock: 65,
		discountPercentage: 10,
	},
	"google_0038.jpg": {
		title: "Chuột máy tính không dây Logitech M330 Silent Plus",
		category: "accessories",
		brand: "Logitech",
		price: 26.99,
		rating: 4.7,
		description:
			"Giảm hơn 90% tiếng ồn khi nhấp chuột, kết nối không dây 2.4GHz ổn định trong phạm vi 10 mét và thời lượng pin lên đến 24 tháng.",
		stock: 130,
		discountPercentage: 12,
	},
	"google_004.jpg": {
		title: "Đồng hồ thông minh Smartwatch Theo Dõi Sức Khỏe Toàn Diện",
		category: "smartwatches",
		brand: "Huawei",
		price: 79.99,
		rating: 4.6,
		description:
			"Trang bị công nghệ theo dõi nhịp tim thông minh, đo nồng độ oxy trong máu SpO2, đo mức độ stress và hàng chục bài tập hướng dẫn chi tiết.",
		stock: 70,
		discountPercentage: 15,
	},
	"google_0041.jpg": {
		title: "Đồng hồ định vị trẻ em 4G LTE Định vị chính xác LBS/GPS",
		category: "smartwatches",
		brand: "Wonlex",
		price: 52.0,
		rating: 4.5,
		description:
			"Thiết bị đeo thông minh định vị trẻ nhỏ chính xác, tích hợp loa ngoài đàm thoại to rõ, danh bạ kiểm soát ngăn chặn số lạ quấy rầy.",
		stock: 85,
		discountPercentage: 8,
	},
	"google_0044.jpg": {
		title: "Chuột không dây văn phòng Xiaomi Wireless Mouse Lite 2",
		category: "accessories",
		brand: "Xiaomi",
		price: 19.99,
		rating: 4.6,
		description:
			"Thiết kế tối giản thanh lịch, đường nét uốn lượn ôm sát lòng bàn tay, cảm biến quang học 1000 DPI mượt mà trên nhiều bề mặt.",
		stock: 140,
		discountPercentage: 20,
	},
	"google_0045.jpg": {
		title: "Chuột máy tính không dây Rapoo M20 Plus Kết nối ổn định",
		category: "accessories",
		brand: "Rapoo",
		price: 18.5,
		rating: 4.5,
		description:
			"Chuột không dây nhỏ gọn, kết nối qua đầu thu nano 2.4GHz cắm là chạy, tiết kiệm năng lượng tối ưu cho thời gian dùng pin cả năm.",
		stock: 110,
		discountPercentage: 10,
	},
	"google_004599.jpg": {
		title: "Chuột quang học không dây Rapoo Silent Văn Phòng",
		category: "accessories",
		brand: "Rapoo",
		price: 19.0,
		rating: 4.4,
		description:
			"Nhấp phím êm ái không gây ồn ào không gian làm việc chung, thiết kế đối xứng thích hợp cho cả người thuận tay trái lẫn tay phải.",
		stock: 95,
		discountPercentage: 15,
	},
	"google_0046.jpg": {
		title: "Chuột máy tính đa chế độ Bluetooth & Wireless 2.4G",
		category: "accessories",
		brand: "Logitech",
		price: 34.0,
		rating: 4.6,
		description:
			"Chuyển đổi linh hoạt giữa hai thiết bị máy tính chỉ bằng một nút bấm, bánh lăn cuộn siêu tốc lướt web và đọc tài liệu nhanh chóng.",
		stock: 90,
		discountPercentage: 10,
	},
	"google_0047.jpg": {
		title: "Chuột quang có dây Dell MS116 Bền bỉ văn phòng",
		category: "accessories",
		brand: "Dell",
		price: 14.99,
		rating: 4.7,
		description:
			"Chuột quang chính hãng Dell với độ bền hàng triệu lượt bấm, độ phân giải 1000 DPI tiêu chuẩn, cáp kết nối USB bền bỉ tương thích mọi PC.",
		stock: 150,
		discountPercentage: 5,
	},
	"google_0049.jpg": {
		title: "Chuột Gaming LED RGB 6 Phím Bấm Điều Chỉnh DPI",
		category: "accessories",
		brand: "Fuhlen",
		price: 24.99,
		rating: 4.5,
		description:
			"Trang bị dải LED RGB đổi màu bắt mắt, 6 nút bấm có thể gán phím macro và các mức DPI linh hoạt đáp ứng mọi thể loại game MOBA, FPS.",
		stock: 100,
		discountPercentage: 20,
	},
	"google_0051.jpg": {
		title: "Chuột công thái học cao cấp Logitech MX Master 2S Ergonomic",
		category: "accessories",
		brand: "Logitech",
		price: 69.99,
		rating: 4.9,
		description:
			"Biểu tượng công thái học dành cho chuyên gia sáng tạo, con lăn điện từ MagSpeed cực nhanh, hỗ trợ di chuột trên mọi bề mặt kính.",
		stock: 45,
		discountPercentage: 10,
	},
	"google_0055.jpg": {
		title: "Chuột không dây công thái học Amkette Ergo Đa kết nối",
		category: "accessories",
		brand: "Amkette",
		price: 34.99,
		rating: 4.6,
		description:
			"Thiết kế nâng đỡ ngón tay cái hoàn hảo, trang bị nút Easy Switch kết nối cùng lúc 3 thiết bị máy tính, laptop và máy tính bảng qua Bluetooth/2.4G.",
		stock: 75,
		discountPercentage: 15,
	},
	"google_0057.jpg": {
		title: "Chuột không dây mini Rapoo M10 Plus Nhẹ Nhàng Tiện Lợi",
		category: "accessories",
		brand: "Rapoo",
		price: 17.99,
		rating: 4.4,
		description:
			"Thiết kế siêu gọn gàng dễ dàng bỏ vào túi xách hoặc balo, lớp sơn nhám mịn chống trơn trượt hiệu quả.",
		stock: 120,
		discountPercentage: 10,
	},
	"google_0063.jpg": {
		title: "Chuột Gaming Không Dây Darmoshark M3 Cảm Biến PAW3395",
		category: "accessories",
		brand: "Darmoshark",
		price: 49.0,
		rating: 4.8,
		description:
			"Trang bị mắt đọc đỉnh cao PAW3395 lên tới 26.000 DPI, trọng lượng siêu nhẹ 58g và kết nối 3 chế độ Type-C, Bluetooth 5.0, Wireless 2.4G.",
		stock: 65,
		discountPercentage: 12,
	},
	"google_0065.jpg": {
		title: "Chuột Gaming Không Dây VGN Dragonfly F1 Siêu Nhẹ 49g",
		category: "accessories",
		brand: "VGN",
		price: 44.99,
		rating: 4.8,
		description:
			"Trọng lượng chỉ 49 gram lướt như bay trên lót chuột, switch cơ học quang học phản hồi tức thì và feet chuột PTFE nguyên chất 100%.",
		stock: 80,
		discountPercentage: 10,
	},
	"google_00655.jpg": {
		title: "Chuột Không Dây Gaming VGN Dragonfly F1 Pro Max",
		category: "accessories",
		brand: "VGN",
		price: 52.0,
		rating: 4.8,
		description:
			"Thời lượng pin lên tới 130 giờ chơi game liên tục, hỗ trợ tốc độ phản hồi 4000Hz siêu mượt đem lại ưu thế vượt trội trong mọi trận đấu.",
		stock: 55,
		discountPercentage: 15,
	},
	"google_0066.jpg": {
		title: "Chuột Không Dây Siêu Nhẹ Pulsar X2 Wireless Trắng Tím",
		category: "accessories",
		brand: "Pulsar",
		price: 95.0,
		rating: 4.9,
		description:
			"Thiết kế đối xứng hoàn mỹ phối màu trắng tím phong cách, cảm biến quang học PixArt PAW3395 cao cấp và lớp vỏ phủ chống bám vân tay đỉnh cao.",
		stock: 40,
		discountPercentage: 10,
	},
	"google_00666.jpg": {
		title: "Chuột Pulsar X2 Mini Wireless Edition Trắng Tím",
		category: "accessories",
		brand: "Pulsar",
		price: 95.0,
		rating: 4.9,
		description:
			"Phiên bản kích thước mini dành cho người có bàn tay vừa và nhỏ, mang lại cảm giác cầm nắm chắc chắn và kiểm soát đường di chuột tuyệt đối.",
		stock: 35,
		discountPercentage: 10,
	},
	"google_0067.jpg": {
		title: "Chuột Gaming Không Dây Razer Cobra Pro RGB Chroma",
		category: "accessories",
		brand: "Razer",
		price: 79.99,
		rating: 4.7,
		description:
			"Đèn nền RGB 11 vùng rực rỡ đồng bộ Razer Chroma, switch quang học Gen 3 không lo double-click và hỗ trợ sạc không dây Razer Mouse Dock Pro.",
		stock: 45,
		discountPercentage: 15,
	},
	"google_0068.jpg": {
		title: "Chuột Không Dây Văn Phòng Logitech Pebble M350 Siêu Mỏng",
		category: "accessories",
		brand: "Logitech",
		price: 25.0,
		rating: 4.7,
		description:
			"Hình dáng viên sỏi tròn trịa độc đáo, phím bấm êm ái Silent Touch, kết nối nhanh qua Bluetooth và đầu thu USB với 18 tháng sử dụng pin.",
		stock: 130,
		discountPercentage: 18,
	},
	"google_0070.jpg": {
		title: "Laptop Asus Vivobook 14 A1407CA Core Ultra 5 225H / 16GB / 512GB",
		category: "laptops",
		brand: "Asus",
		price: 749.0,
		rating: 4.8,
		description:
			"Laptop AI thế hệ mới với vi xử lý Intel Core Ultra 5 225H tích hợp NPU AI, màn hình 14 inch IPS WUXGA tỉ lệ 16:10 sắc nét, RAM 16GB đa nhiệm mượt mà.",
		stock: 30,
		discountPercentage: 10,
	},
	"google_0076.jpg": {
		title: "Đồng hồ thông minh Smartwatch HD Bluetooth Call 1.9 inch",
		category: "smartwatches",
		brand: "Colmi",
		price: 45.0,
		rating: 4.5,
		description:
			"Màn hình tràn viền 1.9 inch hiển thị rực rỡ ngoài trời, bàn phím số quay số trực tiếp trên đồng hồ, hỗ trợ đo điện tâm đồ và đếm bước chân.",
		stock: 85,
		discountPercentage: 15,
	},
	"google_0081.jpg": {
		title: "Laptop Acer Swift Go 14 OLED Intel Core Ultra 5 / 16GB / 512GB",
		category: "laptops",
		brand: "Acer",
		price: 699.0,
		rating: 4.8,
		description:
			"Thiết kế nhôm nguyên khối siêu mỏng nhẹ chỉ 1.3kg, màn hình OLED chuẩn màu điện ảnh 100% DCI-P3 cùng công nghệ âm thanh vòm sống động.",
		stock: 35,
		discountPercentage: 12,
	},
	"google_0082.jpg": {
		title: "Laptop HP Pavilion 15 Core i5 1335U / 16GB / 512GB SSD",
		category: "laptops",
		brand: "HP",
		price: 599.0,
		rating: 4.7,
		description:
			"Hiệu năng tin cậy phục vụ mọi nhu cầu học tập và văn phòng, bàn phím full-size có phím số tiện lợi và thời lượng pin sử dụng lên tới 8 tiếng.",
		stock: 40,
		discountPercentage: 8,
	},
	"google_0083.jpg": {
		title: "Laptop Gaming Lenovo Legion Y7000 Core i7 / RTX 4060 / 165Hz",
		category: "laptops",
		brand: "Lenovo",
		price: 1099.0,
		rating: 4.9,
		description:
			"Cỗ máy chiến game hàng đầu với card đồ họa NVIDIA GeForce RTX 4060, hệ thống tản nhiệt Legion Coldfront buồng hơi và màn hình 165Hz siêu tốc.",
		stock: 25,
		discountPercentage: 10,
	},
	"google_0084.jpg": {
		title: "Laptop Asus Zenbook 14 Flip OLED Cảm Ứng Xoay Gập 360",
		category: "laptops",
		brand: "Asus",
		price: 899.0,
		rating: 4.8,
		description:
			"Bản lề xoay 360 độ biến hóa linh hoạt giữa laptop và tablet, màn hình cảm ứng OLED rực rỡ hỗ trợ bút cảm ứng Asus Pen vẽ đồ họa chuyên nghiệp.",
		stock: 28,
		discountPercentage: 10,
	},
	"google_0085.jpg": {
		title:
			"Laptop Dell Precision / XPS 15 Màn hình 4K UHD 100% sRGB Thiết kế đồ họa",
		category: "laptops",
		brand: "Dell",
		price: 1399.0,
		rating: 4.9,
		description:
			"Màn hình 4K UHD chuẩn đồ họa 100% sRGB, vỏ nhôm cắt CNC phối carbon fiber cao cấp cùng cấu hình khủng đáp ứng dựng video 4K và đồ họa 3D.",
		stock: 18,
		discountPercentage: 5,
	},
	"google_0086.jpg": {
		title: "Laptop Dell Latitude 5440 Bền bỉ chuẩn quân đội",
		category: "laptops",
		brand: "Dell",
		price: 649.0,
		rating: 4.7,
		description:
			"Dòng máy doanh nhân danh tiếng với độ bền đạt chuẩn quân đội Mỹ MIL-STD, bảo mật vân tay và chip TPM 2.0 an toàn thông tin tuyệt đối.",
		stock: 35,
		discountPercentage: 10,
	},
	"google_0087.jpg": {
		title: "Laptop Dell Inspiron 14 5430 Core i5 / 16GB / 512GB Nhôm Bạc",
		category: "laptops",
		brand: "Dell",
		price: 579.0,
		rating: 4.6,
		description:
			"Thiết kế viền mỏng thanh lịch màu bạc sang trọng, tỉ lệ màn hình 16:10 tối ưu hiển thị tài liệu cùng âm thanh Waves MaxxAudio Pro sống động.",
		stock: 45,
		discountPercentage: 12,
	},
	"google_0088.jpg": {
		title: "Laptop Acer Aspire 5 A515 Core i5 Đồ Họa & Văn Phòng",
		category: "laptops",
		brand: "Acer",
		price: 529.0,
		rating: 4.6,
		description:
			"Màn hình 15.6 inch IPS FHD chống lóa, hệ thống tản nhiệt kép hai quạt nâng cao luồng gió và khả năng nâng cấp RAM ổ cứng cực kỳ dễ dàng.",
		stock: 50,
		discountPercentage: 15,
	},
	"google_0089.jpg": {
		title: "Robot hút bụi lau sàn thông minh Xiaomi Mijia Mop 2 Ultra",
		category: "smart-home",
		brand: "Xiaomi",
		price: 429.0,
		rating: 4.8,
		description:
			"Lực hút siêu mạnh 4000Pa kết hợp cảm biến ToF 3D tránh chướng ngại vật chuẩn xác, tự động gom bụi vào trạm sạc với dung tích túi chứa lớn 4L.",
		stock: 22,
		discountPercentage: 10,
	},
	"google_0090.jpg": {
		title: "Laptop Lenovo IdeaPad Slim 3 15IAH8 Core i5 / 16GB RAM",
		category: "laptops",
		brand: "Lenovo",
		price: 499.0,
		rating: 4.6,
		description:
			"Trọng lượng nhẹ, khung máy chắc chắn, trang bị khóa camera riêng tư và công nghệ sạc nhanh Rapid Charge nạp 80% pin chỉ sau 60 phút.",
		stock: 40,
		discountPercentage: 10,
	},
	"google_00909.jpg": {
		title: "Laptop Lenovo IdeaPad Slim 5 Nhôm Nguyên Khối Màn OLED",
		category: "laptops",
		brand: "Lenovo",
		price: 649.0,
		rating: 4.7,
		description:
			"Màn hình OLED 2.5K sống động, viền kim loại sang trọng, vi xử lý AMD Ryzen 7 tiết kiệm pin tối ưu cho cả ngày dài học tập làm việc.",
		stock: 30,
		discountPercentage: 12,
	},
	"google_009099.jpg": {
		title: "Laptop Lenovo Yoga Slim 7 Mỏng Nhẹ Thời Trang",
		category: "laptops",
		brand: "Lenovo",
		price: 799.0,
		rating: 4.8,
		description:
			"Thiết kế siêu mỏng thanh lịch, bàn phím gõ êm ái trứ danh của Lenovo, cảm biến thông minh tự động khóa máy khi người dùng rời đi.",
		stock: 25,
		discountPercentage: 8,
	},
	"google_0091.jpg": {
		title: "Laptop Asus ExpertBook B1 Doanh Nhân Nhẹ Bền Chuẩn Quân Đội",
		category: "laptops",
		brand: "Asus",
		price: 719.0,
		rating: 4.7,
		description:
			"Thiết kế tối ưu cho doanh nghiệp với cổng kết nối đa dạng từ HDMI đến VGA, bàn phím chống tràn nước và thời lượng pin cả ngày.",
		stock: 32,
		discountPercentage: 10,
	},
	"google_0094.jpg": {
		title: "Robot hút bụi lau nhà Eufy Clean X9 Pro Omni Station Tự Giặt Giẻ",
		category: "smart-home",
		brand: "Eufy",
		price: 699.0,
		rating: 4.9,
		description:
			"Hệ thống con lăn kép MopMaster xoay 180 vòng/phút đánh bay vết bẩn cứng đầu, trạm Omni tự động giặt giẻ và sấy khô bằng khí nóng khử khuẩn.",
		stock: 18,
		discountPercentage: 12,
	},
	"google_0095 (copy 1).jpg": {
		title: "Laptop MSI Modern 14 C12MO Core i5 / 16GB / 512GB Nhôm Đen",
		category: "laptops",
		brand: "MSI",
		price: 549.0,
		rating: 4.6,
		description:
			"Thiết kế thời thượng, bản lề mở 180 độ dễ dàng chia sẻ nội dung trong các buổi thảo luận, phím bấm có hành trình sâu cho trải nghiệm gõ thoải mái.",
		stock: 38,
		discountPercentage: 15,
	},
	"google_0096.jpg": {
		title: "Laptop Dell Vostro 3520 Màn hình 120Hz Mượt Mà Văn Phòng",
		category: "laptops",
		brand: "Dell",
		price: 519.0,
		rating: 4.6,
		description:
			"Màn hình 15.6 inch tần số quét 120Hz giúp cuộn trang siêu mượt mà, cấu hình vi xử lý Intel Core thế hệ 12 giải quyết mượt mà mọi file Excel nặng.",
		stock: 44,
		discountPercentage: 10,
	},
	"google_0097.jpg": {
		title: "Chuột Gaming RGB Thermaltake Iris Optical Cảm Biến Cao Cấp",
		category: "accessories",
		brand: "Thermaltake",
		price: 39.99,
		rating: 4.6,
		description:
			"Dải LED viền RGB Aura nhiều hiệu ứng bắt mắt, cảm biến quang học PixArt PMW-3325 lên đến 5000 DPI điều chỉnh theo từng tựa game.",
		stock: 80,
		discountPercentage: 20,
	},
	"google_028.jpg": {
		title: "Laptop Gaming Asus TUF Gaming F15 Core i7 / RTX 4050 144Hz",
		category: "laptops",
		brand: "Asus",
		price: 849.0,
		rating: 4.8,
		description:
			"Độ bền đạt chuẩn quân đội, bàn phím có đèn nền RGB một vùng, card đồ họa rời RTX 4050 hỗ trợ DLSS 3 chiến mượt mà mọi bom tấn game hiện nay.",
		stock: 28,
		discountPercentage: 10,
	},
	"naver_0006.jpg": {
		title: "Đồng hồ thông minh nữ AMOLED 1.43 inch Viền Thép Rose Gold",
		category: "smartwatches",
		brand: "Haylou",
		price: 69.99,
		rating: 4.7,
		description:
			"Mặt tròn AMOLED 466*466 pixel siêu sắc nét, dây đeo kim loại dạng lưới vàng hồng thời thượng, đàm thoại Bluetooth và theo dõi chu kỳ phái đẹp.",
		stock: 65,
		discountPercentage: 15,
	},
	"naver_0008.jpg": {
		title: "Điện thoại Vivo V11 Pro Màn hình Super AMOLED Xanh Gradient",
		category: "smartphones",
		brand: "Vivo",
		price: 299.0,
		rating: 4.6,
		description:
			"Màn hình tràn viền Halo FullView công nghệ Super AMOLED sống động, cảm biến vân tay quang học trong màn hình và camera kép AI xoá phông nghệ thuật.",
		stock: 50,
		discountPercentage: 15,
	},
	"naver_0014.jpg": {
		title: "Đồng hồ thông minh Joyroom JR-FT3 Pro Smartwatch HD Gọi Thoại",
		category: "smartwatches",
		brand: "Joyroom",
		price: 49.0,
		rating: 4.6,
		description:
			"Màn hình cảm ứng lớn 1.83 inch sắc nét, hỗ trợ nghe gọi trực tiếp hai chiều, kiểm tra lượng calo tiêu thụ và theo dõi giấc ngủ hàng đêm.",
		stock: 90,
		discountPercentage: 20,
	},
	"naver_0015.jpg": {
		title: "Bàn phím cơ không dây RK61 RGB 60% Red Switch Hot-swap",
		category: "accessories",
		brand: "Royal Kludge",
		price: 49.99,
		rating: 4.8,
		description:
			"Layout 61 phím siêu nhỏ gọn tiết kiệm tối đa diện tích bàn làm việc, hỗ trợ 3 chế độ kết nối Type-C, Bluetooth và 2.4GHz, switch đỏ gõ êm mượt mà.",
		stock: 85,
		discountPercentage: 12,
	},
	"naver_00159.jpg": {
		title: "Bàn phím cơ không dây RK61 Pro Vỏ Nhôm RGB Đa Kết Nối",
		category: "accessories",
		brand: "Royal Kludge",
		price: 59.99,
		rating: 4.8,
		description:
			"Khung vỏ nhôm CNC đầm chắc chắn, keycap PBT doubleshot bền màu không bóng dầu cùng hệ thống đèn LED RGB tùy biến nhiều chế độ.",
		stock: 70,
		discountPercentage: 10,
	},
	"naver_0016.jpg": {
		title: "Đồng hồ thông minh thể thao QCY Smartwatch Dây Silicon Chống Nước",
		category: "smartwatches",
		brand: "QCY",
		price: 39.0,
		rating: 4.5,
		description:
			"Màn hình cảm ứng trực quan, đo nhịp tim liên tục, thông báo cuộc gọi và tin nhắn Zalo, Facebook nhanh chóng, pin dùng lên tới 10 ngày.",
		stock: 80,
		discountPercentage: 10,
	},
	"naver_0017.jpg": {
		title: "Đồng hồ thông minh GPS Thể Thao Ngoài Trời Amazfit Bip",
		category: "smartwatches",
		brand: "Amazfit",
		price: 75.0,
		rating: 4.6,
		description:
			"Tích hợp GPS định vị quãng đường chạy bộ và đạp xe chính xác, màn hình hiển thị rõ ràng dưới ánh nắng gắt cùng thời lượng pin 14 ngày bền bỉ.",
		stock: 60,
		discountPercentage: 12,
	},
	"naver_0020.jpg": {
		title: "Đồng hồ thông minh Huawei Watch Fit Special Edition Màn AMOLED",
		category: "smartwatches",
		brand: "Huawei",
		price: 89.0,
		rating: 4.8,
		description:
			"Màn hình chữ nhật cong 2.5D tuyệt đẹp, hơn 10.000 mặt đồng hồ phong cách, huấn luyện viên thể thao ảo trực tiếp trên cổ tay.",
		stock: 55,
		discountPercentage: 10,
	},
	"naver_0022.jpg": {
		title: "Bộ 10 Kính Cường Lực Baseus Chống Xước Màn Hình iPad Pro 11-inch",
		category: "accessories",
		brand: "Baseus",
		price: 19.99,
		rating: 4.7,
		description:
			"Độ cứng chuẩn 9H chống trầy xước và va đập hiệu quả, độ trong suốt cao 99% không ảnh hưởng chất lượng hiển thị và độ nhạy cảm ứng Apple Pencil.",
		stock: 120,
		discountPercentage: 25,
	},
	"naver_0025.jpg": {
		title: "Đồng hồ thông minh mặt vuông viền kim loại sang trọng",
		category: "smartwatches",
		brand: "Zeblaze",
		price: 59.0,
		rating: 4.5,
		description:
			"Vỏ hợp kim kẽm cao cấp, hỗ trợ đàm thoại rảnh tay qua Bluetooth, theo dõi nồng độ SpO2 và hơn 100 chế độ tập luyện chuyên sâu.",
		stock: 75,
		discountPercentage: 15,
	},
	"naver_0030.jpg": {
		title: "Đồng hồ thông minh quân đội Kospet Tank M2 Chống Nước Chống Va Đập",
		category: "smartwatches",
		brand: "Kospet",
		price: 79.99,
		rating: 4.8,
		description:
			"Đạt tiêu chuẩn quân đội Mỹ MIL-STD-810H, chịu va đập mạnh, chống nước ở độ sâu 50m, vỏ giáp bọc thép bảo vệ hoàn hảo trong môi trường khắc nghiệt.",
		stock: 50,
		discountPercentage: 10,
	},
	"naver_0031.jpg": {
		title: "Đồng hồ thể thao dã ngoại Amazfit T-Rex Thám Hiểm Ngoài Trời",
		category: "smartwatches",
		brand: "Amazfit",
		price: 99.0,
		rating: 4.8,
		description:
			"Hệ thống định vị vệ tinh kép GPS độ chính xác cao, chịu nhiệt độ từ -40°C đến 70°C và pin trâu cho những chuyến trekking dài ngày.",
		stock: 45,
		discountPercentage: 10,
	},
	"naver_0032.jpg": {
		title: "Đồng hồ thông minh Xiaomi Watch S1 Active Thể Thao Cao Cấp",
		category: "smartwatches",
		brand: "Xiaomi",
		price: 89.0,
		rating: 4.7,
		description:
			"Viền kim loại tinh xảo, màn hình AMOLED 1.43 inch 60Hz mượt mà, hỗ trợ thanh toán không chạm và gọi điện Bluetooth chỉ với 1 chạm.",
		stock: 65,
		discountPercentage: 14,
	},
	"naver_0034.jpg": {
		title: "Đồng hồ thông minh theo dõi sức khỏe Garmin Venu Sq GPS",
		category: "smartwatches",
		brand: "Garmin",
		price: 149.0,
		rating: 4.9,
		description:
			"Đo năng lượng cơ thể Body Battery, mức độ căng thẳng, nhịp thở và nồng độ oxy trong máu liên tục, cùng các bài tập có hình động hướng dẫn.",
		stock: 35,
		discountPercentage: 8,
	},
	"naver_0035.jpg": {
		title: "Đồng hồ thông minh mặt tròn thời trang Haylou Solar Plus RT3",
		category: "smartwatches",
		brand: "Haylou",
		price: 65.0,
		rating: 4.6,
		description:
			"Màn hình AMOLED sắc nét viền bo cong 2.5D, hỗ trợ tính năng Always On Display và đàm thoại rõ ràng ngay cả khi đang di chuyển ngoài đường.",
		stock: 70,
		discountPercentage: 15,
	},
	"naver_0043.jpg": {
		title: "Pin sạc dự phòng Remax RPP-292 Sạc Nhanh 22.5W 20000mAh",
		category: "accessories",
		brand: "Remax",
		price: 32.0,
		rating: 4.6,
		description:
			"Dung lượng chuẩn 20000mAh sạc được nhiều lần cho điện thoại, hỗ trợ công nghệ sạc nhanh chuẩn PD & QC tương thích với cả iPhone và Android.",
		stock: 95,
		discountPercentage: 12,
	},
	"naver_0044.jpg": {
		title: "Pin sạc dự phòng Ubon 10000mAh Tích hợp sẵn 3 cáp sạc đa năng",
		category: "accessories",
		brand: "Ubon",
		price: 29.99,
		rating: 4.7,
		description:
			"Không cần mang theo dây sạc rườm rà với 3 đầu cáp Micro USB, Type-C và Lightning được tích hợp sẵn gọn gàng sau lưng pin dự phòng.",
		stock: 105,
		discountPercentage: 18,
	},
	"naver_0048.jpg": {
		title: "Pin sạc dự phòng Romoss Sense 8+ Dung Lượng Khủng 30000mAh",
		category: "accessories",
		brand: "Romoss",
		price: 42.0,
		rating: 4.7,
		description:
			"Thoải mái vi vu dã ngoại cả tuần với dung lượng pin cực khủng 30000mAh, hỗ trợ 3 cổng vào và 3 cổng ra sạc cùng lúc 3 thiết bị an toàn.",
		stock: 80,
		discountPercentage: 10,
	},
	"naver_0060.jpg": {
		title: "Pin sạc dự phòng không dây Belkin MagSafe 5000mAh Chuẩn Qi",
		category: "accessories",
		brand: "Belkin",
		price: 59.99,
		rating: 4.9,
		description:
			"Hít nam châm từ tính MagSafe cực mạnh vào lưng iPhone, thiết kế mỏng nhẹ không chắn cụm camera, bảo vệ kiểm soát nhiệt độ thông minh.",
		stock: 50,
		discountPercentage: 10,
	},
	"naver_0063.jpg": {
		title: "Pin sạc dự phòng Xiaomi Mi Power Bank 3 Vỏ Nhôm 10000mAh",
		category: "accessories",
		brand: "Xiaomi",
		price: 25.0,
		rating: 4.8,
		description:
			"Vỏ kim loại hợp kim nhôm Anodize chống bám vân tay và tản nhiệt tốt, trang bị chế độ sạc dòng điện nhỏ an toàn cho tai nghe và đồng hồ thông minh.",
		stock: 130,
		discountPercentage: 15,
	},
	"naver_0068.jpg": {
		title: "Pin sạc dự phòng Baseus Bipow Digital Display 20W 10000mAh",
		category: "accessories",
		brand: "Baseus",
		price: 28.0,
		rating: 4.7,
		description:
			"Màn hình LED kỹ thuật số hiển thị phần trăm pin theo thời gian thực, công suất sạc nhanh PD 20W nạp 50% pin iPhone chỉ trong 30 phút.",
		stock: 110,
		discountPercentage: 14,
	},
	"naver_00684.jpg": {
		title: "Pin sạc dự phòng Baseus Bipow 20W 20000mAh Màn Hình Số",
		category: "accessories",
		brand: "Baseus",
		price: 36.0,
		rating: 4.7,
		description:
			"Phiên bản 20000mAh bền bỉ hơn, đáp ứng nhu cầu sạc liên tục nhiều ngày, tích hợp chip kiểm soát dòng sạc ngăn quá áp quá dòng.",
		stock: 85,
		discountPercentage: 10,
	},
	"naver_0069.jpg": {
		title: "Pin sạc dự phòng Hoco J86 Powermaster 22.5W Có Đèn LED Chiếu Sáng",
		category: "accessories",
		brand: "Hoco",
		price: 24.0,
		rating: 4.5,
		description:
			"Tích hợp đèn LED chiếu sáng tiện ích khi mất điện hoặc cắm trại ban đêm, hỗ trợ sạc nhanh đa giao thức SCP/FCP/QC/PD tiện dụng.",
		stock: 100,
		discountPercentage: 15,
	},
	"naver_0070.jpg": {
		title: "Pin sạc dự phòng Anker 325 Power Bank PowerCore 20000mAh",
		category: "accessories",
		brand: "Anker",
		price: 45.0,
		rating: 4.9,
		description:
			"Thương hiệu phụ kiện hàng đầu thế giới với công nghệ độc quyền PowerIQ điều chỉnh dòng điện tối ưu cho từng thiết bị, lõi pin Polymer an toàn.",
		stock: 75,
		discountPercentage: 10,
	},
	"naver_00707.jpg": {
		title: "Pin sạc dự phòng Anker 313 PowerCore Slim 10000mAh Siêu Mỏng",
		category: "accessories",
		brand: "Anker",
		price: 35.0,
		rating: 4.8,
		description:
			"Thiết kế thanh mảnh chỉ dày khoảng 14mm, bề mặt vân nhám cao cấp chống trượt, dễ dàng bỏ túi quần mang theo bên mình mọi lúc mọi nơi.",
		stock: 90,
		discountPercentage: 12,
	},
	"naver_0072.jpg": {
		title: "Đồng hồ thông minh Smartwatch Màn Hình Lớn Hiển Thị Số Nổi Bật",
		category: "smartwatches",
		brand: "Colmi",
		price: 39.99,
		rating: 4.5,
		description:
			"Mặt kính cong 2.5D sang trọng, giao diện đồng hồ số to rõ ràng phù hợp mọi lứa tuổi, tích hợp đo huyết áp, nhịp tim và báo thức rung êm ái.",
		stock: 95,
		discountPercentage: 15,
	},
	"naver_0074.jpg": {
		title: "Pin sạc dự phòng Awei P134K 20000mAh Chống Cháy Nổ Cao Cấp",
		category: "accessories",
		brand: "Awei",
		price: 26.0,
		rating: 4.5,
		description:
			"Chất liệu nhựa ABS+PC chống cháy đạt tiêu chuẩn an toàn hàng không, trang bị 2 cổng xuất USB và cổng nạp Type-C hiện đại.",
		stock: 90,
		discountPercentage: 10,
	},
	"naver_0075.jpg": {
		title: "Pin sạc dự phòng Joyroom D-M219 10000mAh 4 Đèn LED Báo Pin",
		category: "accessories",
		brand: "Joyroom",
		price: 22.5,
		rating: 4.6,
		description:
			"Trọng lượng nhẹ, kích thước nhỏ gọn như bao thuốc lá, 4 đèn LED thông minh báo mức pin trực quan và cơ chế ngắt dòng tự động khi đầy.",
		stock: 110,
		discountPercentage: 12,
	},
	"naver_0080.jpg": {
		title: "Pin sạc dự phòng Remax RPP-20 Bỏ Túi Thời Trang 10000mAh",
		category: "accessories",
		brand: "Remax",
		price: 21.0,
		rating: 4.5,
		description:
			"Thiết kế bo cong mềm mại tinh tế, hỗ trợ sạc ổn định cho các dòng smartphone phổ biến hiện nay, độ bền cao không lo chai phù pin.",
		stock: 115,
		discountPercentage: 15,
	},
	"naver_0084.jpg": {
		title: "Pin sạc dự phòng LifeCharge Dual USB 10400mAh Đèn Pin Đôi",
		category: "accessories",
		brand: "LifeCharge",
		price: 27.99,
		rating: 4.6,
		description:
			"Trang bị 2 cổng sạc USB cùng 2 đèn pin LED đôi siêu sáng cực kỳ hữu ích trong các chuyến đi phượt và tình huống khẩn cấp.",
		stock: 80,
		discountPercentage: 10,
	},
	"naver_0086.jpg": {
		title: "Pin sạc dự phòng Anker PowerCore Slim 10000mAh Sạc Nhanh 2 Cổng",
		category: "accessories",
		brand: "Anker",
		price: 39.99,
		rating: 4.9,
		description:
			"Chất lượng đỉnh cao từ Anker với vỏ ngoài nhám sần sang trọng, công nghệ VoltageBoost bù dòng kháng cự dây cáp giúp sạc nhanh tối đa.",
		stock: 85,
		discountPercentage: 10,
	},
	"naver_0089.jpg": {
		title: "Pin sạc dự phòng mini du lịch Baseus Pocket Power Bank 5000mAh",
		category: "accessories",
		brand: "Baseus",
		price: 19.99,
		rating: 4.6,
		description:
			"Kích thước siêu nhỏ nằm trọn trong lòng bàn tay, cung cấp năng lượng khẩn cấp cứu cánh điện thoại trong cả ngày dài làm việc.",
		stock: 125,
		discountPercentage: 20,
	},
	"naver_0090.jpg": {
		title: "Pin sạc dự phòng Ubon 3 Cổng USB & Type-C 10000mAh Sạc Nhanh",
		category: "accessories",
		brand: "Ubon",
		price: 31.0,
		rating: 4.6,
		description:
			"Hỗ trợ 3 cổng sạc đồng thời với dòng điện 2.4A ổn định, thiết kế vỏ vân sần chống bám mồ hôi và đèn LED chỉ báo pin 4 mức.",
		stock: 90,
		discountPercentage: 15,
	},
	"naver_0098.jpg": {
		title: "Pin sạc dự phòng Remax Lõi Pin Polymer Cao Cấp 10000mAh",
		category: "accessories",
		brand: "Remax",
		price: 23.5,
		rating: 4.5,
		description:
			"Lõi pin Lithium Polymer cao cấp chống cháy nổ, thiết kế tối giản trẻ trung với các góc vát tròn dễ chịu khi cầm cùng điện thoại.",
		stock: 100,
		discountPercentage: 10,
	},
	"naver_068.jpg": {
		title: "Pin sạc dự phòng Baseus Mini JA 10000mAh 2 Cổng Sạc Nhanh",
		category: "accessories",
		brand: "Baseus",
		price: 27.0,
		rating: 4.7,
		description:
			"Hỗ trợ sạc nhanh qua cả cổng Type-C và Micro-USB, cảm biến nhiệt độ tự động điều chỉnh ngăn ngừa hiện tượng quá nhiệt gây hại thiết bị.",
		stock: 105,
		discountPercentage: 12,
	},
}

// Hàm dự phòng cho bất kỳ ảnh nào phát sinh thêm
function generateFallbackProduct(filename: string): ProductSeedItem {
	const cleanName = filename
		.replace(/\.[^/.]+$/, "")
		.replace(/[-_]/g, " ")
		.replace(/\(copy \d+\)/g, "")
		.trim()

	let category = "accessories"
	let brand = "TechStore"
	let basePrice = 49.99
	let description = "Sản phẩm công nghệ chính hãng chất lượng cao tại TechNor."

	if (filename.includes("iphone") || filename.includes("samsung")) {
		category = "smartphones"
		brand = filename.includes("iphone") ? "Apple" : "Samsung"
		basePrice = 899.0
		description =
			"Điện thoại thông minh đỉnh cao công nghệ với màn hình sắc nét và hiệu năng mạnh mẽ."
	} else if (filename.includes("google")) {
		category = "smartwatches"
		brand = "Google"
		basePrice = 99.0
		description =
			"Thiết bị đeo thông minh hỗ trợ theo dõi sức khỏe và kết nối không dây tiện lợi."
	} else if (filename.includes("naver")) {
		category = "accessories"
		brand = "Baseus"
		basePrice = 35.0
		description =
			"Phụ kiện công nghệ cao cấp đáp ứng hoàn hảo nhu cầu sử dụng hàng ngày."
	}

	return {
		title: `Sản phẩm ${cleanName}`,
		category,
		brand,
		price: basePrice,
		rating: 4.5,
		description,
		stock: 50,
		discountPercentage: 10,
	}
}

async function main() {
	const uploadsDir = path.resolve(process.cwd(), "public/uploads")
	console.log(`🔍 Đang quét thư mục ảnh: ${uploadsDir}`)

	if (!fs.existsSync(uploadsDir)) {
		throw new Error(`Thư mục không tồn tại: ${uploadsDir}`)
	}

	const files = fs
		.readdirSync(uploadsDir)
		.filter((f) => /\.(jpe?g|png|webp|gif|svg)$/i.test(f))
		.sort()

	console.log(`📁 Tìm thấy ${files.length} ảnh trong public/uploads`)

	console.log("🧹 Đang dọn dẹp và reset ID bảng products về 1...")
	try {
		await prisma.$executeRawUnsafe("TRUNCATE TABLE products")
	} catch (err) {
		await prisma.product.deleteMany({})
		await prisma.$executeRawUnsafe("ALTER TABLE products AUTO_INCREMENT = 1")
	}

	const productsToCreate = files.map((file) => {
		const meta = detailedProductMap[file] || generateFallbackProduct(file)

		return {
			title: meta.title || `Sản phẩm ${file}`,
			image: `/uploads/${file}`,
			price: meta.price ?? Number((Math.random() * 200 + 20).toFixed(2)),
			rating: meta.rating ?? Number((Math.random() * 1.2 + 3.8).toFixed(1)),
			description:
				meta.description ?? "Sản phẩm công nghệ chính hãng tại TechNor.",
			category: meta.category ?? "accessories",
			brand: meta.brand ?? "TechNor",
			stock: meta.stock ?? Math.floor(Math.random() * 80 + 20),
			discountPercentage:
				meta.discountPercentage ?? Math.floor(Math.random() * 20),
		}
	})

	console.log(
		`🚀 Đang chèn ${productsToCreate.length} sản phẩm vào database tech_nor...`,
	)

	// Sử dụng createMany để chèn hàng loạt nhanh chóng và an toàn
	const result = await prisma.product.createMany({
		data: productsToCreate,
	})

	console.log(
		`✅ Đã chèn thành công ${result.count} sản phẩm vào bảng products!`,
	)

	// Thống kê phân loại danh mục
	const summary = await prisma.product.groupBy({
		by: ["category"],
		_count: { id: true },
	})
	console.log("\n📊 Thống kê sản phẩm theo danh mục:")
	summary.forEach((item) => {
		console.log(` - ${item.category}: ${item._count.id} sản phẩm`)
	})

	// Lấy mẫu 3 sản phẩm đầu tiên để kiểm tra
	const sample = await prisma.product.findMany({ take: 3 })
	console.log("\n🔎 Mẫu 3 sản phẩm đầu tiên:")
	console.log(JSON.stringify(sample, null, 2))

	console.log("\n👤 Đang tạo tài khoản mẫu (Admin & Khách hàng)...")
	try {
		await prisma.$executeRawUnsafe("TRUNCATE TABLE users")
	} catch (e) {
		await prisma.user.deleteMany({})
	}

	await prisma.user.create({
		data: {
			email: "admin@technor.com",
			password: "admin123",
			name: "Quản Trị Viên",
			address: "Hà Nội, Việt Nam",
			role: "ADMIN",
		},
	})

	await prisma.user.create({
		data: {
			email: "user@technor.com",
			password: "user123",
			name: "Khách Hàng TechNor",
			address: "TP. Hồ Chí Minh, Việt Nam",
			role: "USER",
		},
	})
	console.log(
		"✅ Đã tạo tài khoản Admin (admin@technor.com) và User (user@technor.com)!",
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
		console.log("\n🎉 Quá trình seed hoàn tất thành công!")
	})
	.catch(async (e) => {
		console.error("❌ Lỗi khi seed sản phẩm:", e)
		await prisma.$disconnect()
		process.exit(1)
	})
