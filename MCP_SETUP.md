# Hướng dẫn cài đặt PostgreSQL MCP cho Cursor

## Tổng quan
Dự án này đã được cấu hình PostgreSQL MCP (Model Context Protocol) để cho phép Cursor tương tác với database PostgreSQL bằng ngôn ngữ tự nhiên.

## Cài đặt

### 1. Kiểm tra file cấu hình
File `.cursor/mcp.json` đã được tạo với 2 tùy chọn:
- **postgresql-enhanced**: Server MCP PostgreSQL nâng cao với nhiều tính năng
- **neon-postgres**: Server MCP cho Neon (bị tắt mặc định)

### 2. Cấu hình biến môi trường
Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database URL cho PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Nếu dùng Neon (tùy chọn)
NEON_API_KEY="your_neon_api_key_here"
```

**Ví dụ:**
```env
# PostgreSQL local
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/f5g_mvp"

# PostgreSQL cloud (Neon, Supabase, etc.)
DATABASE_URL="postgresql://user:pass@db.example.com:5432/mydb?sslmode=require"
```

### 3. Khởi động lại Cursor
Sau khi cấu hình xong:
1. Khởi động lại Cursor hoặc reload window (Ctrl+Shift+P → "Developer: Reload Window")
2. Mở Cursor Settings → Features → MCP
3. Kiểm tra xem PostgreSQL MCP server đã được kích hoạt chưa

## Sử dụng

### Mở Cursor Composer
- Nhấn `Ctrl+I` (Windows) hoặc `Cmd+I` (Mac)
- Chọn **Agent** mode

### Các lệnh mẫu
```
Liệt kê tất cả các bảng trong database
Hiển thị 5 dòng đầu tiên của bảng users
Thêm cột created_at vào bảng products
Tạo bảng mới để lưu comments
Phân tích hiệu suất database
Tạo index cho cột email trong bảng users
```

## Tính năng PostgreSQL MCP Enhanced

### Quản lý Database
- Liệt kê và mô tả bảng
- Tạo, sửa, xóa bảng
- Quản lý indexes
- Phân tích schema

### Truy vấn SQL
- Thực thi SQL queries
- Transactions
- Query performance analysis
- EXPLAIN plans

### Migration & Schema
- Tạo và quản lý migrations
- Backup/restore data
- Schema comparison
- Table alterations

### Tối ưu Performance
- Slow query analysis
- Index recommendations
- Query optimization
- Performance monitoring

## Bảo mật

⚠️ **Lưu ý quan trọng:**
- MCP server này có nhiều quyền mạnh mẽ
- Luôn xem lại các lệnh trước khi cho phép thực thi
- Backup database trước khi chạy migration
- Không chia sẻ DATABASE_URL chứa password

## Troubleshooting

### Lỗi kết nối
```bash
# Kiểm tra PostgreSQL có chạy không
pg_isready -h localhost -p 5432

# Test connection string
psql "postgresql://username:password@localhost:5432/database_name"
```

### MCP server không hoạt động
1. Kiểm tra file `.cursor/mcp.json` có đúng syntax không
2. Restart Cursor
3. Kiểm tra biến môi trường DATABASE_URL
4. Xem Console trong Cursor Settings → MCP

### Quá nhiều tools
Nếu Cursor báo quá nhiều tools (>40), có thể disable một số tools không cần thiết trong Cursor Settings → MCP.

## Các MCP Server khác

Ngoài PostgreSQL MCP, bạn có thể thêm các server khác:
- **Neon MCP**: Cho Neon PostgreSQL cloud
- **Supabase MCP**: Cho Supabase
- **Generic SQL MCP**: Cho các database khác

## Tài liệu tham khảo
- [PostgreSQL MCP Server GitHub](https://github.com/HenkDz/postgresql-mcp-server)
- [Cursor MCP Documentation](https://docs.cursor.com/context/model-context-protocol)
- [Model Context Protocol](https://modelcontextprotocol.io/) 