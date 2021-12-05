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

class Plus(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('isbn', type=str)
            parser.add_argument('content', type=str)
            parser.add_argument('userid', type=str)
            args = parser.parse_args()
            

            doc = ok(args['content'])
            w2 = w2v(doc)

            new_model = KeyedVectors.load_word2vec_format('book_model_f.bin', binary=True)
            new_model[args['isbn']] = w2;
            result = new_model.most_similar(args['isbn'])
            print(result)
            
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

from flask import Flask
from flask_restful import Api

app = Flask('My First App')
api = Api(app)
api.add_resource(Plus, '/plus')

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
        app.run(host='0.0.0.0', port=8000, debug=True)