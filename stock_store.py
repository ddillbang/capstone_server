
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

if __name__ == "__main__":
    
    books = search_book('나미야잡화점의기적')['items']
    
    """for book in books:
        isbn_ = format(book(['isbn']))
        print(isbn_)"""
    
    
    
    for i,book in enumerate(books):
        isbn = book['isbn']
        title = book['title']
        #print(isbn[11:])
        isbn_.append(isbn[11:])
        book_name.append(title)
    
print(isbn_)



for book in books:

    print('title: {}'.format(book['title']))

    print('author: {}'.format(book['author']))

    print('pubdate: {}'.format(book['pubdate']))

    print('ISBN: {}'.format(book['isbn']))
    isbn = book['isbn']
    print(isbn[11:])

    print('-------------------------')


from bs4 import BeautifulSoup
import requests
import re

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
print(re.sub(pattern=pattern, repl='', string=book_name[0]) + '   ISBN : ' + isbn_[0] + '-----------검색 책 결과')


print(stock)
