
# ---------------------------------------------------------
# 알라딘 온라인 매장에서 구매( 새책 )
# 새책은 온라인에서 구매하는 듯 함. ( 재고 확인X )
#
# 검색 하려는 책 ISBN 필요

from bs4 import BeautifulSoup
import requests

ISBN = '9791188388905'

url = 'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=ttbtimber31539001&itemIdType=ISBN13&ItemId=' + ISBN + '&output=xml'

res = requests.get(url)
res.raise_for_status

soup = BeautifulSoup(res.text,"html.parser")

book_names = soup.find_all("title")

price = soup.find("pricesales").get_text()

for book_name in book_names:
    print(book_name.get_text())


print(price)
