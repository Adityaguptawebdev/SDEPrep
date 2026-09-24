// Sample data used in every MongoDB note and in interview-questions.md
// Run in mongosh:   load("sample-data.js")     (it uses a database called "shop")

const shop = db.getSiblingDB("shop");
shop.users.drop();
shop.products.drop();
shop.orders.drop();

shop.users.insertMany([
  { _id: 1, name: "Asha",  age: 28, city: "Delhi",  email: "asha@example.com",  skills: ["js", "node", "mongodb"], active: true,  address: { city: "Delhi",  pin: "110001" } },
  { _id: 2, name: "Ravi",  age: 35, city: "Mumbai", email: "ravi@example.com",  skills: ["java", "sql"],           active: true,  address: { city: "Mumbai", pin: "400001" } },
  { _id: 3, name: "Meena", age: 22, city: "Delhi",                              skills: ["python", "sql", "mongodb"], active: false },
  { _id: 4, name: "Karan", age: 41, city: "Pune",   email: "karan@example.com", skills: ["go"],                    active: true },
  { _id: 5, name: "Sara",  age: 30, city: "Mumbai", email: "sara@example.com",  skills: [],                        active: true }
]);

shop.products.insertMany([
  { _id: "P1", name: "Pen",        category: "stationery",  price: 10,    stock: 200, tags: ["office", "writing"] },
  { _id: "P2", name: "Notebook",   category: "stationery",  price: 50,    stock: 100, tags: ["office", "paper"] },
  { _id: "P3", name: "Laptop",     category: "electronics", price: 55000, stock: 15,  tags: ["computer", "work"] },
  { _id: "P4", name: "Mouse",      category: "electronics", price: 500,   stock: 80,  tags: ["computer", "accessory"] },
  { _id: "P5", name: "Desk Lamp",  category: "home",        price: 800,   stock: 0,   tags: ["light"] },
  { _id: "P6", name: "Headphones", category: "electronics", price: 2000,  stock: 40,  tags: ["audio", "accessory"] }
]);

shop.orders.insertMany([
  { _id: 101, userId: 1, status: "delivered", date: ISODate("2024-01-05"), items: [ { sku: "P1", qty: 10, price: 10 }, { sku: "P2", qty: 2, price: 50 } ], total: 200 },
  { _id: 102, userId: 1, status: "delivered", date: ISODate("2024-02-10"), items: [ { sku: "P3", qty: 1, price: 55000 } ], total: 55000 },
  { _id: 103, userId: 2, status: "shipped",   date: ISODate("2024-02-15"), items: [ { sku: "P4", qty: 2, price: 500 } ], total: 1000 },
  { _id: 104, userId: 3, status: "cancelled", date: ISODate("2024-03-01"), items: [ { sku: "P6", qty: 1, price: 2000 } ], total: 2000 },
  { _id: 105, userId: 2, status: "delivered", date: ISODate("2024-03-12"), items: [ { sku: "P1", qty: 5, price: 10 }, { sku: "P4", qty: 1, price: 500 } ], total: 550 },
  { _id: 106, userId: 4, status: "pending",   date: ISODate("2024-03-20"), items: [ { sku: "P2", qty: 4, price: 50 } ], total: 200 },
  { _id: 107, userId: 1, status: "shipped",   date: ISODate("2024-03-25"), items: [ { sku: "P6", qty: 2, price: 2000 }, { sku: "P4", qty: 1, price: 500 } ], total: 4500 }
]);
