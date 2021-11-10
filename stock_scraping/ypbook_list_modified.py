
# --------------------------------------------
#
# 영풍문고 책 검색시 리스트 출력하는 방식으로 바꿈
#
#----------------------------------------------

# --------------------------
# 1. 책 검색 
# 2. 해당 이름을 포함한 책들의 리스트
# 3. 각 책 페이지로 들어가서 사진, 가격 스크래핑
#---------------------------


from bs4 import BeautifulSoup
import requests
import re

# ------------------------ 책검색------------------------



yp_book_name = input(' 책 이름을 입력해 주세요. : ')

url = 'https://www.ypbooks.co.kr/servlet/searchBooks?target=&query='+ yp_book_name + '&convert=fw'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

find_books = soup.find_all("ark")



# ------------------------ 검색한 책 리스트 ------------------------


linkname = []

for index in range(0,len(find_books)):

    linkname.append(find_books[index]["linkname"])

    find_name = find_books[index]["keyword"]

    url = 'https://www.ypbooks.co.kr/book.yp?bookcd='+ linkname[index]
    res_ = requests.get(url)
    soup_ = BeautifulSoup(res_.text,"html.parser")
    
    print(find_name)


    #----------------------- 책 표지 출력 부분 ---------------------
    
    find_img = soup_.find("img", attrs={"id":"book_img"})["src"]

    print(f"책 이미지 : {find_img}")



    # ------------------------ 책 가격 출력 부분  ----------------------

    selling_price = soup_.find("strong", attrs={"class":"price03"}).get_text()

    print(f"판매가: {selling_price}")



# ----------------------책 선택 리스트 보기 ----------------------



select_book = int(input('몇번 책을 고르시겠습니까?'))

url = 'https://www.ypbooks.co.kr/book.yp?bookcd='+ linkname[select_book-1]


res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

price = soup.find("dd", attrs= {"class":"productPrice"})


# ------------------------검색을 위한 정가 검색 -------------------------

real_price = price.find("strong").get_text()

pattern = ','
real_price = re.sub(pattern = pattern, repl= '', string = real_price)


# ------------------------ 재고 확인 사이트 접속 후 재고 출력 ------------------------------

url = 'http://www.ypbooks.co.kr/ypbooks/book/branchStockLoc.jsp?bookCd='+ linkname[select_book-1] + '&bookCost=' + real_price + '&josgaNo1=12'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

num = soup.find_all("span")
store = soup.find_all("strong")

num = num[2:]

stock = {}

for i, j in zip(store, num):
    i = i.text
    i = i.strip()

    if i == '':
        pass
    else:
        stock[i] = j.text

print(stock)




