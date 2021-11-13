# -----------------------------------------------------------
#
# 중고 책 검색을 했을 경우 ( 지점 한개만 선택 가능 ) 
# 1. 책 표지를 보여줌
# 2. 책 가격을 보여줌
# 3. 책 수량을 보여줌

# 책 제목 필요

# --------------- 알라딘 중고 책 list & 재고 -----------------

from bs4 import BeautifulSoup
import requests

book_name = '모모'

KeytagDongsungro = 'B00'

url = 'https://www.aladin.co.kr/search/wsearchresult.aspx?SearchWord=' + book_name + '&KeyTag='+ KeytagDongsungro + '&SearchTarget=UsedStore&x=0&y=0'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text,"html.parser")

book_list = soup.find("div" , attrs={"id":"Search3_Result"})

# ------------------------ 알라딘 중고 책 검색 후 사진 받기 ---------------------------

styles = soup.find_all("div", attrs={"style":"position:relative;"})

for index in range(0,len(styles)):
    style = styles[index].find("img")["src"]
    print(style)

# ----------------------- 리스트 중 책 이름 -------------------------

search_book_names = book_list.find_all("li")


for index in range(0,len(search_book_names)):
    search_book_name = search_book_names[index].find("a")
    if search_book_name == None:
        pass
    else:
        result = search_book_name.find("b")
        if result == None:
            pass
        else:
            print(result.get_text())

# -----------------------  중고 가격 -------------------------

prices = soup.find_all("span", attrs={"class":"ss_p2"})

for index in range(0,len(prices)):
    price = prices[index].find("b")
    print(price.get_text())


# --------------------- 중고 수량 --------------------------

stocks = soup.find_all("span", attrs={"class":"ss_p4"})

for index in range(0,len(stocks)):
    stock = stocks[index].find("b")
    print(stock.get_text())





