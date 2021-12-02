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


class Plus(Resource):
    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('isbn', type=str)
            parser.add_argument('content', type=str)
            args = parser.parse_args()
            
            doc = ok(args['content'])
            w2 = w2v(doc)
  
            new_model = KeyedVectors.load_word2vec_format('test_model10')

            new_model[args['isbn']] = w2;
            
            result = new_model.most_similar(args['isbn'])
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
    model = Word2Vec.load('ehlwk.model')

    k = KeyedVectors.load_word2vec_format('test_model4')
    
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