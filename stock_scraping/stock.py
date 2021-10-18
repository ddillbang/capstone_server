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


#--------------------------------------------교보문고------------------------------------------

url = 'http://www.kyobobook.co.kr/prom/2013/general/StoreStockTable.jsp?barcode=' + isbn_[0] + '&ejkgb=KOR'

res = requests.get(url)
res.raise_for_status()

soup = BeautifulSoup(res.text, "lxml")

[x.decompose() for x in soup.findAll(lambda tag: (not tag.contents or len(tag.get_text(strip=True)) <= 0))]
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

#--------------------------------------------영풍문고------------------------------------------

url = 'https://www.ypbooks.co.kr/servlet/searchBooks?target=&query='+ search_book_name + '&convert=fw'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

find_books = soup.find_all("ark")

book_code = 0

for find_book in find_books:
    if find_book['keyword'] == search_book_name:
        print(find_book['linkname'])
        book_code = find_book['linkname']


url = 'https://www.ypbooks.co.kr/book.yp?bookcd='+ book_code

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text, "html.parser")

price = soup.find("dd", attrs= {"class":"productPrice"})

real_price = price.find("strong").get_text()

print(real_price)

pattern = ','
real_price = re.sub(pattern = pattern, repl= '', string = real_price)

print(real_price)

url = 'http://www.ypbooks.co.kr/ypbooks/book/branchStockLoc.jsp?bookCd='+ book_code + '&bookCost=' + real_price + '&josgaNo1=12'

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

# ----------------- 알라딘 서점에서 '중고' 책 검색 ---------------------

from bs4 import BeautifulSoup
import requests

isbn = isbn_[0]
branch_office = 'Daegu'

url = 'https://www.aladin.co.kr/usedstore/wproduct.aspx?ISBN='+ isbn +'&offcode='+ branch_office

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text,"html.parser")

books = soup.find_all("span", attrs= {"class":"ss_p4"})

#book_sum = 0

book = books[0].get_text()
book = book.strip()
book_sum = int(book[:-1])

#    book_sum += book

print('\n\n'+'-'*20+' 알라딘 중고 서점 ' +'-'*20 + '\n')
print(branch_office + ": "+ str(book_sum))
print('\n\n')

