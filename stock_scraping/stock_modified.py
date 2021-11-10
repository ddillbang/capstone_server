from bs4 import BeautifulSoup
import requests
import re


CLIENT_ID = '7A8FYyi0nZ3z64aOPagT'

CLIENT_SECRET = '6QlkgYzwDR'



def search_book(query):

    from urllib.request import Request, urlopen

    from urllib.parse import urlencode, quote

    import json



    request = Request('https://openapi.naver.com/v1/search/book?query='+quote(query))

    request.add_header('X-Naver-Client-Id', CLIENT_ID)

    request.add_header('X-Naver-Client-Secret', CLIENT_SECRET)



    response = urlopen(request).read().decode('utf-8')

    search_result = json.loads(response)

    return search_result

isbn = []
isbn_ = []
book_name =[]

search_book_name = []

search_book_name = input('책 이름을 입력해주세요.')



if __name__ == "__main__":

    books = search_book(search_book_name)['items']

    """for book in books:
        isbn_ = format(book(['isbn']))
        print(isbn_)"""



    for i,book in enumerate(books):
        isbn = book['isbn']
        title = book['title']
        #print(isbn[11:])
        isbn_.append(isbn[11:])
        book_name.append(title)


pattern = '<[^>]*>'

for book in books:

    #print('title: {}'.format(book['title']))

    book_title = book['title']

    pattern = '<[^>]*>'
    
    print(re.sub(pattern=pattern, repl='', string = book_title))


    print('author: {}'.format(book['author']))

    print('pubdate: {}'.format(book['pubdate']))

    print('ISBN: {}'.format(book['isbn']))
    isbn = book['isbn']
    print(isbn[11:])

    print('-------------------------')


#============================================교보문고==========================================

url = 'http://www.kyobobook.co.kr/prom/2013/general/StoreStockTable.jsp?barcode=' + isbn_[0] + '&ejkgb=KOR'

res = requests.get(url)
res.raise_for_status()

soup = BeautifulSoup(res.text, "lxml")

#[x.decompose() for x in soup.findAll(lambda tag: (not tag.contents or len(tag.get_text(strip=True)) <= 0))]
store = soup.select('th')
num = soup.select('a')

stock = {}
for i, j in zip(store, num):
    i = i.text
    i = i.strip()

    if i == '':
        pass
    else:
        stock[i] = j.text

# 책 이름에 태그 지우고 출력
pattern = '<[^>]*>'
print(re.sub(pattern=pattern, repl='', string=book_name[0]) + '   ISBN : ' + isbn_[0] + '  \n ' + '>'*50 + ' 책 검색 결과 ' + '<'*50 )


print('\n'+'-'*20 +' 교보문고 ' +'-'*20 + '\n')
print(stock)
print('\n\n')

#===========================================영풍문고=======================================

yp_book_name = search_book_name

url = 'https://www.ypbooks.co.kr/servlet/searchBooks?target=&query='+ yp_book_name + '&convert=fw'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

find_books = soup.find_all("ark")
# 추가 필요 - 검색 했으면 해당 책이 없으면 book_code 들을 통해 책 표지를 나열해서 보여줘야함.

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

print('\n\n'+'-'*20+' 영풍문고 ' +'-'*20 + '\n')
print(stock)
print('\n\n')

# ========================================== 알라딘에서 '중고' 책 검색 ============================================

isbn = isbn_[0]
branch_office = 'Daegu'

book_name = search_book_name

KeytagDongsungro = 'B00' # 대구 동성로점 지명 코드

url = 'https://www.aladin.co.kr/search/wsearchresult.aspx?SearchWord=' + book_name + '&KeyTag='+ KeytagDongsungro + '&SearchTarget=UsedStore&x=0&y=0'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text,"html.parser")

book_list = soup.find("div" , attrs={"id":"Search3_Result"})

print('\n\n'+'-'*20+' 알라딘 중고 서점 ' +'-'*20 + '\n')
print('\n\n')

# ------------------------ 알라딘 중고 책 검색 후 사진 받기 ---------------------------

styles = soup.find_all("div", attrs={"style":"position:relative;"})

for index in range(0,len(styles)):
    style = styles[index].find("img")["src"]
    print(style)
    # if style in "https":
    #     print(style)

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