# TÀI LIỆU GIẢI THÍCH TOÀN BỘ LOGIC HỆ THỐNG (BACKEND & FRONTEND)

> **Dự án**: Tech-Nor E-Commerce  
> **Mục đích**: Hướng dẫn chi tiết từng file, giải thích code logic, lý do thay đổi và cách thức hoạt động giữa Frontend và Backend để bạn học tập và làm chủ codebase.

---

## MỤC LỤC

- [TÀI LIỆU GIẢI THÍCH TOÀN BỘ LOGIC HỆ THỐNG (BACKEND \& FRONTEND)](#tài-liệu-giải-thích-toàn-bộ-logic-hệ-thống-backend--frontend)
  - [MỤC LỤC](#mục-lục)
  - [1. Kiến Trúc Tổng Thể Hệ Thống](#1-kiến-trúc-tổng-thể-hệ-thống)
  - [2. Cơ Sở Dữ Liệu \& Prisma ORM](#2-cơ-sở-dữ-liệu--prisma-orm)
    - [2.1. Thêm trường `role` vào bảng `User`](#21-thêm-trường-role-vào-bảng-user)
    - [2.2. Dữ liệu mẫu (Database Seed)](#22-dữ-liệu-mẫu-database-seed)
  - [3. Chi Tiết Logic Backend](#3-chi-tiết-logic-backend)
    - [3.1. Mô hình phân tầng](#31-mô-hình-phân-tầng)
    - [3.2. Express Routes và Bài Học Thứ Tự Route](#32-express-routes-và-bài-học-thứ-tự-route)
      - [Vấn đề gặp phải:](#vấn-đề-gặp-phải)
      - [Cách khắc phục:](#cách-khắc-phục)
    - [3.3. Repository - Xử Lý Truy Vấn Prisma](#33-repository---xử-lý-truy-vấn-prisma)
      - [a. Lọc động (Dynamic Filtering) trong `getAll`:](#a-lọc-động-dynamic-filtering-trong-getall)
      - [b. Lấy danh mục kèm số lượng sản phẩm (`getCategories`):](#b-lấy-danh-mục-kèm-số-lượng-sản-phẩm-getcategories)
    - [3.4. Controller - Xử Lý Request \& Response](#34-controller---xử-lý-request--response)
      - [Chuẩn hóa kiểu dữ liệu cho Frontend:](#chuẩn-hóa-kiểu-dữ-liệu-cho-frontend)
    - [3.5. Hệ Thống Xác Thực và Phân Quyền Role](#35-hệ-thống-xác-thực-và-phân-quyền-role)
      - [Cơ chế bảo mật mật khẩu (Bcrypt):](#cơ-chế-bảo-mật-mật-khẩu-bcrypt)
  - [4. Chi Tiết Logic Frontend](#4-chi-tiết-logic-frontend)
    - [4.1. Kết Nối API Backend Thay Vì DummyJSON](#41-kết-nối-api-backend-thay-vì-dummyjson)
    - [4.2. Xử Lý Ảnh và Vite Proxy](#42-xử-lý-ảnh-và-vite-proxy)
      - [Vấn đề:](#vấn-đề)
      - [Giải pháp 2 lớp:](#giải-pháp-2-lớp)
    - [4.3. Quản Lý Role Bằng Redux Toolkit](#43-quản-lý-role-bằng-redux-toolkit)
    - [4.4. Logic Lọc Danh Mục (Category Filter)](#44-logic-lọc-danh-mục-category-filter)
      - [Cách thức hoạt động:](#cách-thức-hoạt-động)
    - [4.5. Logic Tìm Kiếm (Search)](#45-logic-tìm-kiếm-search)
      - [Luồng tìm kiếm:](#luồng-tìm-kiếm)
    - [4.6. Bảo Vệ Trang Quản Trị (Admin Dashboard)](#46-bảo-vệ-trang-quản-trị-admin-dashboard)
      - [Kiểm soát truy cập (Access Control):](#kiểm-soát-truy-cập-access-control)
  - [5. Tổng Kết Luồng Dữ Liệu (End-to-End Data Flow)](#5-tổng-kết-luồng-dữ-liệu-end-to-end-data-flow)
  - [6. Danh Sách Tài Khoản Thử Nghiệm](#6-danh-sách-tài-khoản-thử-nghiệm)

---

## 1. Kiến Trúc Tổng Thể Hệ Thống

Trước đây, Frontend của dự án gọi API ngoài (DummyJSON) để lấy dữ liệu giả lập. Toàn bộ dữ liệu không được lưu trữ trong máy chủ cục bộ và không có cơ chế quản lý role người dùng (Admin vs User).

Sau khi tái cấu trúc:

```
[React Frontend (Port 5173)]
        │
        │ HTTP REST API (qua Vite Proxy hoặc http://localhost:5000/api/v1)
        ▼
[Express Backend (Port 5000)]
   ├── Route       : Định tuyến URL
   ├── Controller  : Kiểm tra tham số req, gọi Service, trả response chuẩn
   ├── Service     : Chứa Business Logic (xác thực, mã hóa, nghiệp vụ)
   └── Repository  : Làm việc trực tiếp với Prisma ORM
        │
        ▼
[Prisma Client] ──> [MySQL Database: tech_nor (Port 3306)]
```

---

## 2. Cơ Sở Dữ Liệu & Prisma ORM

### 2.1. Thêm trường `role` vào bảng `User`

- **File**: `backend/prisma/schema.prisma`
- **Thay đổi**:

  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique @db.VarChar(255)
    password  String   @db.VarChar(255)
    name      String?  @db.VarChar(255)
    address   String?  @db.Text
    role      String   @default("USER") @db.VarChar(50)  // <-- Thêm trường này
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@map("users")
  }
  ```

- **Tại sao**:
  - Trường `role` phân biệt tài khoản thường (`USER`) và tài khoản quản trị (`ADMIN`).
  - `@default("USER")`: Mặc định khi khách hàng đăng ký mới sẽ mang quyền `USER`, tránh việc người dùng tự cấp quyền Admin.
  - Lệnh đồng bộ DB: `npm exec prisma db push` cập nhật bảng trong MySQL mà không làm mất dữ liệu.

### 2.2. Dữ liệu mẫu (Database Seed)

- **File**: `backend/prisma/seed.ts`
- **Chức năng**:
  - Quét thư mục ảnh `backend/public/uploads` (có 105 file ảnh).
  - Tự động phân loại category (`smartphones`, `laptops`, `audio`, `watches`, `gaming`, `accessories`) và gán giá ngẫu nhiên, mô tả, rating, brand.
  - Tạo sẵn 2 tài khoản:
    - **ADMIN**: `admin@technor.com` / Mật khẩu: `admin123` (role: `ADMIN`)
    - **USER**: `user@technor.com` / Mật khẩu: `user123` (role: `USER`)
  - Chạy bằng lệnh: `npm exec tsx prisma/seed.ts`.

---

## 3. Chi Tiết Logic Backend

### 3.1. Mô hình phân tầng

Backend tuân thủ nghiêm ngặt mô hình **Controller - Service - Repository**:

1. **Route**: Chỉ khai báo đường dẫn URL và phương thức HTTP (GET, POST, PUT, DELETE).
2. **Controller**: Lấy dữ liệu từ `req.query`, `req.params`, `req.body`. Gọi Service tương ứng và trả JSON về client (`res.json(...)`). Không viết câu lệnh truy vấn database ở đây.
3. **Service**: Chứa logic xử lý nghiệp vụ (ví dụ: băm mật khẩu với `bcryptjs`, kiểm tra email đã tồn tại chưa, tính toán, kiểm tra quyền).
4. **Repository**: Chứa các hàm Prisma tương tác trực tiếp với MySQL (`findMany`, `create`, `update`, `delete`, `groupBy`).

---

### 3.2. Express Routes và Bài Học Thứ Tự Route

- **File**: `backend/src/routes/product.route.ts`

#### Vấn đề gặp phải:

Trong Express Router, nếu bạn viết:

```typescript
// SAI:
productRoute.get("/:id", productController.getById)
productRoute.get("/categories", productController.getCategories)
productRoute.get("/search", productController.search)
```

Khi client gửi request tới `/api/v1/products/categories`, Express sẽ kiểm tra từ trên xuống dưới. Vì `/:id` nhận mọi chuỗi ký tự, Express sẽ hiểu nhầm chuỗi `"categories"` là một `id` (tham số biến). Sau đó nó ép `"categories"` thành số (`Number("categories")` -> `NaN`) và gây ra lỗi hoặc trả về không tìm thấy sản phẩm!

#### Cách khắc phục:

**Luôn khai báo các Static Routes (đường dẫn cố định) TRƯỚC Dynamic Routes (đường dẫn có tham số biến `/:id`)**:

```typescript
// ĐÚNG:
productRoute.get("/", productController.getAll)
productRoute.get("/categories", productController.getCategories)
productRoute.get("/search", productController.search)
productRoute.get("/category/:category", productController.getByCategory)
productRoute.get("/:id", productController.getById) // <-- Đặt ở cuối cùng
```

---

### 3.3. Repository - Xử Lý Truy Vấn Prisma

- **File**: `backend/src/repository/product.repository.ts`

#### a. Lọc động (Dynamic Filtering) trong `getAll`:

```typescript
getAll: async (filters: ProductFilters = {}): Promise<Product[]> => {
	const { category, brand, search, limit, skip, sort, order = "asc" } = filters
	const where: any = {}

	// Lọc theo Category
	if (category) {
		where.category = category
	}

	// Lọc theo Brand
	if (brand) {
		where.brand = brand
	}

	// Tìm kiếm trong Title, Description hoặc Category
	if (search) {
		where.OR = [
			{ title: { contains: search } },
			{ description: { contains: search } },
			{ category: { contains: search } },
		]
	}

	const orderBy: any = {}
	if (sort) {
		orderBy[sort] = order
	} else {
		orderBy.id = "asc"
	}

	const queryArgs: any = { where, orderBy }
	if (limit) queryArgs.take = Number(limit)
	if (skip) queryArgs.skip = Number(skip)

	return await prisma.product.findMany(queryArgs)
}
```

_Giải thích_:

- Dùng object `where` rỗng. Nếu client truyền tham số nào thì mới thêm điều kiện đó vào `where`.
- `where.OR`: Tìm kiếm sản phẩm nếu `search` xuất hiện trong tên, mô tả HOẶC danh mục.
- Xử lý `exactOptionalPropertyTypes` của TypeScript: chỉ gán `take` và `skip` khi có giá trị thực sự, tránh gán `undefined`.

#### b. Lấy danh mục kèm số lượng sản phẩm (`getCategories`):

```typescript
getCategories: async (): Promise<CategorySummary[]> => {
	const categories = await prisma.product.groupBy({
		by: ["category"],
		_count: {
			id: true,
		},
	})

	return categories.map((c) => ({
		slug: c.category,
		name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
		count: c._count.id,
		url: `/category/${c.category}`,
	}))
}
```

_Giải thích_:

- Dùng `prisma.product.groupBy({ by: ['category'] })` để nhóm các sản phẩm theo từng danh mục và đếm số lượng `_count.id` tương ứng trong MySQL.
- Map kết quả trả về `slug`, `name` (viết hoa chữ cái đầu), và `count` số lượng mặt hàng.

---

### 3.4. Controller - Xử Lý Request & Response

- **File**: `backend/src/controller/product.controller.ts`

#### Chuẩn hóa kiểu dữ liệu cho Frontend:

Prisma lưu `Decimal` hoặc `Float` trong DB. Frontend React cũ của bạn trước đây dùng API DummyJSON mong đợi các thuộc tính:

- `products`: Mảng sản phẩm
- `thumbnail`: Đường dẫn ảnh đại diện
- `price`: Số (number)

Controller thực hiện chuyển đổi như sau:

```typescript
const formattedProducts = products.map((p) => ({
	...p,
	price: Number(p.price),
	thumbnail: p.image, // ánh xạ từ trường image của DB sang thumbnail
}))

// Trả về cả 'products' và 'data' để tương thích ngược với mọi trang frontend
return res.status(200).json({
	status: "success",
	total: formattedProducts.length,
	products: formattedProducts,
	data: formattedProducts,
})
```

_Lợi ích_: Frontend dù đọc `res.data.products` hay `res.data.data` đều nhận được dữ liệu chính xác và không bị crash giao diện.

---

### 3.5. Hệ Thống Xác Thực và Phân Quyền Role

- **Files**:
  - `backend/src/models/user.model.ts`
  - `backend/src/repository/user.repository.ts`
  - `backend/src/services/auth.service.ts`
  - `backend/src/controller/auth.controller.ts`
  - `backend/src/routes/auth.route.ts`

#### Cơ chế bảo mật mật khẩu (Bcrypt):

```typescript
// Trong auth.service.ts:
login: async (credentials: LoginDTO) => {
	const user = await userRepository.findUser(credentials.email)
	if (!user) {
		throw new Error("Email hoặc mật khẩu không chính xác")
	}

	// So sánh mật khẩu người dùng nhập với hash trong database
	const isPasswordValid = await bcrypt.compare(
		credentials.password,
		user.password,
	)
	if (!isPasswordValid) {
		throw new Error("Email hoặc mật khẩu không chính xác")
	}

	// LOẠI BỎ password trước khi gửi về client
	const { password, ...userWithoutPassword } = user
	return userWithoutPassword
}
```

_Tại sao_: Không bao giờ lưu mật khẩu dạng plaintext trong DB và không bao giờ trả trường `password` về cho trình duyệt. Thông tin trả về bao gồm `id`, `email`, `name`, `address`, và `role`.

---

## 4. Chi Tiết Logic Frontend

### 4.1. Kết Nối API Backend Thay Vì DummyJSON

- **File**: `frontend/src/api.ts`

```typescript
export const BASE_URL = "http://localhost:5000/api/v1"
```

Thay vì gọi `https://dummyjson.com/products`, toàn bộ ứng dụng gọi tới server backend Node.js cục bộ:

- Danh sách sản phẩm: `GET http://localhost:5000/api/v1/products`
- Lọc danh mục: `GET http://localhost:5000/api/v1/products/category/:category`
- Danh sách danh mục: `GET http://localhost:5000/api/v1/products/categories`
- Tìm kiếm: `GET http://localhost:5000/api/v1/products/search?q=...`
- Chi tiết 1 sản phẩm: `GET http://localhost:5000/api/v1/products/:id`

---

### 4.2. Xử Lý Ảnh và Vite Proxy

- **File**: `frontend/vite.config.ts`
- **File**: `frontend/src/api.ts`

#### Vấn đề:

Backend lưu ảnh tại thư mục `backend/public/uploads/...`. Trong DB, trường `image` lưu đường dẫn dạng `/uploads/iphone-15.jpg`.
Frontend chạy ở port 5173, nếu gọi `<img src="/uploads/iphone-15.jpg" />` thì trình duyệt sẽ tìm ở port 5173 (Frontend) thay vì port 5000 (Backend), dẫn đến ảnh bị lỗi 404.

#### Giải pháp 2 lớp:

1. **Vite Proxy** (`frontend/vite.config.ts`):

   ```typescript
   server: {
     proxy: {
       "/uploads": {
         target: "http://localhost:5000",
         changeOrigin: true,
       }
     }
   }
   ```

   Mọi request bắt đầu bằng `/uploads` sẽ được Vite tự động chuyển tiếp tới `http://localhost:5000/uploads`.

2. **Hàm tiện ích `getProductImageUrl`** (`frontend/src/api.ts`):
   ```typescript
   export const getProductImageUrl = (url?: string | null): string => {
   	if (!url) return "https://placehold.co/400x400/png?text=No+Image"
   	if (url.startsWith("http://") || url.startsWith("https://")) return url
   	if (url.startsWith("/uploads")) return `http://localhost:5000${url}`
   	return `http://localhost:5000/uploads/${url}`
   }
   ```
   Hàm này tự động xử lý mọi trường hợp: nếu là ảnh ngoài giữ nguyên, nếu là đường dẫn tương đối sẽ nối với URL của backend.

---

### 4.3. Quản Lý Role Bằng Redux Toolkit

- **Files**:
  - `frontend/src/models/AuthSlice.ts`: Định nghĩa kiểu dữ liệu `UserProfile` có trường `role: "ADMIN" | "USER" | string`.
  - `frontend/src/redux/features/authSlice.ts`:

    ```typescript
    // Khôi phục phiên đăng nhập từ localStorage khi reload trang
    const savedUserStr = localStorage.getItem("technor_user")
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null

    const initialState: AuthState = {
    	isLoggedIn: !!savedUser,
    	username: savedUser?.name || savedUser?.email || "",
    	role: savedUser?.role || "USER",
    	user: savedUser || null,
    	modalOpen: false,
    }
    ```

- Khi đăng nhập thành công (`loginSuccess`):
  1. Cập nhật state Redux: `state.isLoggedIn = true`, `state.role = action.payload.role`.
  2. Lưu vào `localStorage.setItem("technor_user", JSON.stringify(action.payload))` để người dùng không bị mất đăng nhập khi F5 lại trang.
- Khi đăng xuất (`doLogout`):
  1. Reset state Redux về ban đầu.
  2. Xoá `localStorage.removeItem("technor_user")`.

---

### 4.4. Logic Lọc Danh Mục (Category Filter)

- **File**: `frontend/src/pages/AllProducts.tsx`

#### Cách thức hoạt động:

1. **Lấy danh sách Categories từ backend**:
   Khi component render lần đầu, gọi song song API lấy danh mục và danh sách sản phẩm:

   ```typescript
   const [categories, setCategories] = useState<CategorySummary[]>([])
   const [selectedCategory, setSelectedCategory] = useState<string>("all")

   useEffect(() => {
   	fetch(`${BASE_URL}/products/categories`)
   		.then((res) => res.json())
   		.then((data) => setCategories(data.data || []))
   }, [])
   ```

2. **Thanh Filter Tabs/Chips tương tác**:
   Người dùng click vào chip danh mục (ví dụ: `smartphones`, `laptops`, `gaming`):

   ```typescript
   const handleCategoryChange = (catSlug: string) => {
   	setSelectedCategory(catSlug)
   	// Gọi API lấy danh sách theo danh mục đó
   	const url =
   		catSlug === "all"
   			? `${BASE_URL}/products?limit=100`
   			: `${BASE_URL}/products/category/${catSlug}`

   	fetch(url)
   		.then((res) => res.json())
   		.then((data) => setProducts(data.products || data.data || []))
   }
   ```

3. **Hiển thị Badge số lượng**: Mỗi nút category hiển thị số lượng sản phẩm hiện có trong danh mục đó (được tính trực tiếp từ database thông qua hàm `getCategories` của backend).

---

### 4.5. Logic Tìm Kiếm (Search)

- **File**: `frontend/src/components/SearchBar.tsx`
- **File**: `frontend/src/pages/SearchPage.tsx`

#### Luồng tìm kiếm:

1. Khi người dùng gõ từ khóa và nhấn Enter hoặc icon Search ở `SearchBar`:
   ```typescript
   navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
   ```
2. Trang `SearchPage` đọc từ khóa từ URL:
   ```typescript
   const [searchParams] = useSearchParams()
   const query = searchParams.get("query") || ""
   ```
3. Khi `query` thay đổi, `useEffect` kích hoạt gửi request về backend:
   ```typescript
   fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`)
   	.then((res) => res.json())
   	.then((data) => setProducts(data.products || []))
   ```
4. Backend nhận request tại `productController.search`, gọi `productService.searchProducts(query)` -> Prisma tìm kiếm bằng toán tử `contains` trong MySQL và trả về danh sách sản phẩm khớp từ khóa.

---

### 4.6. Bảo Vệ Trang Quản Trị (Admin Dashboard)

- **File**: `frontend/src/pages/AdminDashboard.tsx`
- **File**: `frontend/src/components/Navbar.tsx` & `CustomPopup.tsx`

#### Kiểm soát truy cập (Access Control):

Ở phía giao diện:

1. Trong `Navbar.tsx` và `CustomPopup.tsx`, liên kết tới trang Quản trị `/admin` chỉ được hiển thị nếu người dùng có `role === "ADMIN"`:
   ```tsx
   {
   	role === "ADMIN" && (
   		<Link to="/admin" className="text-indigo-600 font-bold">
   			Admin Panel
   		</Link>
   	)
   }
   ```
2. Trong trang `AdminDashboard.tsx`, có thêm lớp bảo vệ trực tiếp:

   ```typescript
   const role = useAppSelector((state) => state.authReducer.role)

   if (role !== "ADMIN") {
       return (
           <div className="text-center py-20">
               <h2>Truy cập bị từ chối</h2>
               <p>Trang này chỉ dành riêng cho tài khoản Quản trị viên (ADMIN).</p>
               <Link to="/">Quay về trang chủ</Link>
           </div>
       )
   }
   ```

3. Các chức năng của Admin:
   - Thống kê tổng số lượng sản phẩm, tổng giá trị kho hàng, danh mục đang hoạt động.
   - **Thêm sản phẩm mới**: Gửi `POST /api/v1/products` để thêm bản ghi mới vào MySQL.
   - **Chỉnh sửa sản phẩm (Edit Product)**:
     - Admin click vào icon cây bút chì (`FaEdit`) tại từng hàng sản phẩm trong bảng.
     - Hệ thống mở Modal Chỉnh Sửa và tự động đổ dữ liệu hiện tại của sản phẩm vào form (`title`, `category`, `brand`, `price`, `stock`, `rating`, `discountPercentage`, `image`, `description`).
     - Khi Admin bấm "Lưu Thay Đổi", Frontend gửi `PUT /api/v1/products/:id` kèm dữ liệu mới.
     - Backend Controller nhận request, gọi `productService.updateProduct(id, req.body)` -> `productRepository.update(id, data)` -> Thực hiện câu lệnh `prisma.product.update` trên MySQL.
     - Sau khi cập nhật thành công, tự động reload lại danh sách dữ liệu mới nhất và hiển thị thông báo Toast.
   - **Quản lý danh sách & Phân trang (Pagination) thông minh**:
     - **Nguyên nhân trước đó chỉ thấy 30 sản phẩm**: Do trong code mẫu ban đầu dùng hàm cắt mảng `products.slice(0, 30)` để tránh làm bảng quá dài khi chưa có phân trang.
     - **Đã nâng cấp**:
       - Tích hợp thanh công cụ tìm kiếm nhanh (`searchTerm`) theo tên, ID, hãng.
       - Bộ lọc theo danh mục (`selectedCategoryFilter`).
       - Bộ chọn số lượng hiển thị (`itemsPerPage`: 10, 20, 50 hoặc **Tất cả ({total})**).
       - Thanh điều hướng phân trang (`currentPage`, các nút 1, 2, 3... và Trang trước / Trang sau).
       - Khi Admin chọn **"Tất cả"**, toàn bộ hơn 105 sản phẩm trong database sẽ được hiển thị đầy đủ trên bảng mà không bị giới hạn.
   - **Xóa sản phẩm**: Gửi `DELETE /api/v1/products/:id` để xóa bản ghi khỏi database MySQL.

---

## 5. Tổng Kết Luồng Dữ Liệu (End-to-End Data Flow)

Dưới đây là sơ đồ tóm tắt cách một tính năng hoạt động xuyên suốt từ giao diện đến cơ sở dữ liệu:

```
[Người dùng click chọn Category 'smartphones']
                     │
                     ▼
[Frontend: AllProducts.tsx - handleCategoryChange("smartphones")]
                     │
                     ▼ Gửi HTTP GET: /api/v1/products/category/smartphones
[Backend Express: product.route.ts]
                     │
                     ▼ Khớp route "/category/:category"
[Backend Controller: productController.getByCategory]
                     │
                     ▼ Gọi productService.getProductsByCategory("smartphones")
[Backend Service: productService]
                     │
                     ▼ Gọi productRepository.getByCategory("smartphones")
[Backend Repository: productRepository]
                     │
                     ▼ prisma.product.findMany({ where: { category: "smartphones" } })
[MySQL: Database tech_nor]
                     │
                     ▼ Trả về danh sách records
[Backend Controller: Chuẩn hóa price sang Number, thumbnail = image]
                     │
                     ▼ Trả về JSON: { status: "success", products: [...] }
[Frontend: Cập nhật state `setProducts(...)`]
                     │
                     ▼
[Giao diện render danh sách ProductCard tương ứng]
```

---

## 6. Danh Sách Tài Khoản Thử Nghiệm

Bạn có thể sử dụng các tài khoản sau đã được seed sẵn trong database:

| Quyền hạn | Email               | Mật khẩu   | Chức năng có thể xem                                                                                      |
| --------- | ------------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| **ADMIN** | `admin@technor.com` | `admin123` | Toàn bộ trang web + Huy hiệu ADMIN + Menu Admin Panel + Trang `/admin` (thêm, xóa, xem thống kê kho hàng) |
| **USER**  | `user@technor.com`  | `user123`  | Mua hàng, xem danh mục, tìm kiếm, giỏ hàng, trang cá nhân, không vào được `/admin`                        |

---

_Tài liệu này được tạo tự động nhằm mục đích hỗ trợ học tập và theo dõi chi tiết toàn bộ logic kỹ thuật của dự án Tech-Nor._
