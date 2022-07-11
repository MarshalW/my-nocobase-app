
```
SERVER_URL=http://localhost:12000

TOKEN=$(curl -s --location --request POST "$SERVER_URL/api/users:signin" \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"admin@nocobase.com",
    "password":"admin123"
}' | jq -j .data.token)

TOKEN=$(curl -s --location --request POST "$SERVER_URL/api/users:signin" \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"wangpeng@hotmail.com",
    "password":"password"
}' | jq -j .data.token)

# 查看 users
curl -s  --location --request GET "$SERVER_URL/api/users" \
--header "Authorization: Bearer $TOKEN" | jq .


# nfts browse
curl -s  --location --request GET "$SERVER_URL/api/nfts:browse" \
--header "Authorization: Bearer $TOKEN" | jq .

# nfts get by id
curl -s  --location --request GET "$SERVER_URL/api/nfts/8" \
--header "Authorization: Bearer $TOKEN" | jq .

# create new order
curl -s  --location --request POST "$SERVER_URL/api/orders:submit" \
--header "Authorization: Bearer $TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
    "nft": 8,
    "pay_method": "weixin",
    "pay_terminal": "android"
}' | jq .

# confirm payment
curl -s  --location --request POST "$SERVER_URL/api/orders:confirm" \
--header "Authorization: Bearer $TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
    "id": 23
}' | jq .

# my list
curl -s  --location --request GET "$SERVER_URL/api/orders:my" \
--header "Authorization: Bearer $TOKEN" \
--header 'Content-Type: application/json' | jq .

```
