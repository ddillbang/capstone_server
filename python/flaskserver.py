try:
    import jpype
    import jpype1
except:
    import jpype
from flask_restful import Resource
from flask_restful import reqparse
from gensim import models
from gensim.models.keyedvectors import load_word2vec_format
import pandas as pd
from gensim.models.word2vec import Word2Vec
from gensim.models import KeyedVectors
import sys
from konlpy.tag import Kkma
import csv
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
import random

header = {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
'Referer': 'https://sso.kmu.ac.kr/kmusso/ext/ctl/login_form.do?Return_Url=https://ctl.kmu.ac.kr/index.jsp',
'Connection': 'keep-alive'
}

header2 = {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
'Referer': 'https://ctl.kmu.ac.kr/Study.do?cmd=viewStudyMyClassroom',
'Connection': 'keep-alive'
}

header3 = {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
'Connection': 'keep-alive'
}



class Plus(Resource):
    def get(self):
        try:
            uId = 1
            parser = reqparse.RequestParser()
            parser.add_argument('isbn', type=str)
            parser.add_argument('content', type=str)
            parser.add_argument('userid', type=str)
            args = parser.parse_args()
            
            if args["userid"] is None:
                uId = None
            

            doc = ok(args['content'])
            w2 = w2v(doc)
            print(type(w2))

            new_model = KeyedVectors.load_word2vec_format('book_model_f.bin', binary=True)
            new_model[args['isbn']] = w2;
            result = new_model.most_similar(args['isbn'])
            
            
            if uId is not None:
                f = open('user_md_f.csv','r')
                rdr = csv.reader(f)
                flag = -1

                for line in rdr:
                    if line[0] == args["userid"]:
                        flag = 0
                        user_vector = line[1]

                f.close()
                new_list=[]

                if flag == 0:
                    user_vector = str(user_vector)[1:-1]

                    for vector in user_vector.split():
                        new_list.append(float(vector))

                    c = (new_list + w2)/2;

                    f2 = open('user_md_f.csv','r')
                    rdr2 = csv.reader(f2)
                    lines = []
                    for line in rdr2:
                        if line[0] == args["userid"]:
                            line[1] = c
                        lines.append(line)

                    f2.close()

                    f3 = open('user_md_f.csv', 'w', newline='')
                    wr = csv.writer(f3)
                    for index in range(len(lines)):
                        wr.writerow(lines[index])
                    f3.close
                
                if(flag == -1):
                    f = open('user_md_f.csv','a',newline='')
                    wr = csv.writer(f)
                    wr.writerow([args["userid"],w2])

            
            return {'result': result}
        except Exception as e:
            return {'error': str(e)}
        

class User(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('userid', type=str)
            args = parser.parse_args()

            new_model = KeyedVectors.load_word2vec_format('book_model_f.bin', binary=True)
            f = open('user_md_f.csv','r')
            rdr = csv.reader(f)

            flag = 0
            for line in rdr:
                if line[0] == args["userid"]:
                    flag = 1
                    user_v = line[1]

            f.close()
            
            if(flag == 1):
                new_list=[]
                new_result = []
                user_v = str(user_v)[1:-1]

                for vector in user_v.split():
                    new_list.append(float(vector))
                    
                new_list = np.array(new_list)
                
                new_model[args['userid']] = new_list;
                result = new_model.most_similar(args['userid'])
                for i in range(5):
                    new_result.append(result[i][0])
                print(new_result)
            else:
                print("ehla")
                random_book = random.sample(new_model.index_to_key,5)
                new_result = random_book
            
            
            return {'result': new_result}
        except Exception as e:
            return {'error': str(e)}
        
class Ctl(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('id', type=str)
            parser.add_argument('pw', type=str)
            args = parser.parse_args()
            
            Login_info = {
                'Return_Url' : 'https://ctl.kmu.ac.kr/index.jsp',
                'loginName' : args['id'],
                'password' : args['pw']
            }

            with requests.Session() as s:
                login_req = s.post('https://sso.kmu.ac.kr/kmusso/ext/ctl/login_process.do', data = Login_info, headers=header)
                html = s.get('https://ctl.kmu.ac.kr/Main.do?cmd=moveMenu&mainDTO.parentMenuId=menu_00026&mainDTO.menuId=menu_00031', cookies=s.cookies, headers = header2)
                soup = bs(html.text, 'html.parser')
                title = soup.select('#listBox > table > tbody > tr > td > a')
                title3 = soup.select('tbody > tr > td:nth-of-type(1)')
                ctl_book = []
                index = 0
                for i in title:
                    k = 'https://ctl.kmu.ac.kr/Course.do?cmd=viewCoursePlanChapterListNew&boardInfoDTO.boardInfoGubun=course_plan&courseDTO.courseId='+i['href'][26:-2]+'&mainDTO.parentMenuId=menu_00047&mainDTO.menuId=menu_00052'
                    html2 = s.get(k,cookies=s.cookies, headers = header3)
                    soup2 = bs(html2.text, 'html.parser')
                    title2 = soup2.select('#listBox > .optionContent')
                    data = {'name' : title3[index].text, 'book' : title2[3].text}
                    ctl_book.append(data)
                    index = index + 1
            
            print(ctl_book)
            
            
            return {'result': ctl_book}
        except Exception as e:
            return {'error': str(e)}


from flask import Flask
from flask_restful import Api

app = Flask('My First App')
api = Api(app)
api.add_resource(Plus, '/plus')
api.add_resource(User, '/user')
api.add_resource(Ctl, '/ctl')

def init():
    global k,model
    model = Word2Vec.load('word_vector_f.model')

    k = KeyedVectors.load_word2vec_format('book_model_f.bin', binary=True)
    
def ok(doc):
    okt = Kkma()
    nouns = okt.nouns(doc)
    doc_nouns = ''

    for noun in nouns:
        doc_nouns += str(noun) + ' '

    return doc_nouns  
    
def w2v(doc):
    doc2vec = None
    count = 0
    for word in doc.split():
        if word in model.wv.index_to_key:
            count += 1
            
            if doc2vec is None:
                doc2vec = model.wv[word]
            else:
                doc2vec = doc2vec + model.wv[word]

    if doc2vec is not None:
        doc2vec = doc2vec / count
    
    return doc2vec

if __name__ == '__main__':
        init()
        app.run()