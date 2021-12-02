import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup as bs
import pandas as pd

book_list = []


for i in range(1,11):
    url1 = 'http://www.yes24.com/24/category/bestseller?CategoryNumber=001001003&sumgb=06&PageNumber=' + str(i) 

    res = requests.get(url1)
    soup = bs(res.text, 'html.parser')
    for n in range(1,21):
        

        if(n == 20):
            print("");
        #tag = '#category_layout > tr:nth-of-type('+ str(2*n -1)+') > td.goodsTxtInfo > p:nth-of-type(1) > a:nth-of-type(1)'
        tag = '#category_layout > tr:nth-of-type(1) > td.goodsTxtInfo > p:nth-of-type(1) > a:nth-of-type(1)'
        books = soup.select(tag);



        for a in books:
            url2 = 'http://www.yes24.com/' + a['href']
            res2 = requests.get(url2)
            soup2 = bs(res2.text, 'html.parser')
            try:
                book_name = soup2.select('#yDetailTopWrap > div.topColRgt > div.gd_infoTop > div > h2')[0].get_text()
            except:
                book_name = ''
            try:
                isbn = soup2.select('#infoset_specific > div.infoSetCont_wrap > div > table > tbody > tr:nth-of-type(3) > td')[0].get_text()
            except:
                isbn = ''
            try:
                book_content = soup2.select('#infoset_introduce > div.infoSetCont_wrap > div.infoWrap_txt > div > textarea')[0].get_text()
            except:
                try:
                    book_content = soup2.select('#infoset_introduce > div.infoSetCont_wrap > table > tbody > tr > td > div > div > textarea')[0].get_text()
                except:
                    book_content = ''

            book_list.append([book_name, isbn, book_content]);

colList = ['name', 'isbn', 'content']

df = pd.DataFrame(np.array(book_list), columns=colList)

df.to_csv("test6.csv", index=False, encoding='CP949')

