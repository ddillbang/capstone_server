from gensim.models import word2vec
from gensim.models import keyedvectors
from gensim.models.keyedvectors import load_word2vec_format
import pandas as pd
from gensim.models.word2vec import Word2Vec
from gensim.models import KeyedVectors
from gensim import models

# data = pd.read_csv('./test7.csv', encoding='CP949')
# cont = data['nouns']
# cn = data['isbn']
# book_val = cont.values.tolist()
# isbn_val = cn.values.tolist()

# corpus = [sent.strip().split(" ") for sent in book_val]
# model = Word2Vec(sentences = corpus, vector_size = 100, window = 5, min_count = 2, workers = 4, sg = 0)
model = Word2Vec.load('ehlwk.model')

book_val = ['메타 버스 에듀 테크 게더 타운 이프 랜드 제페토 가상현실 코스 페이시스 를 교육 현장 활용 혁신 교육 에듀 테크 실현 수 가장 실용 지침 가상현실 증강현실 거울 세계 라이프 깅 인공 지능 미래 인재 위 교육 행사 기획 활용 가이드 요즘 메타 버스 게더 타운 제페토 이프 랜드 이용 온라인 행사 학교 수업 기업 기관 대학 성과 홍보 학술 대회 성과 전시회 신제품 발표회 메타 버스 구축 성공 운영 게더 타운 제페토 이프 랜드 메타 버스 플랫폼 참여자 아바타 이용 상호작용 메타 버스 에듀 테크 메타 버스 분야 가상현실 증강현실 거울 세계 라이프 깅 메타 버스 교육 기획 행사 기획 활용 가이드 기획 메타 버스 에듀 테크 실현 혁신 교육 행사 기획 여러분 도움 네이버 블로그 마련 교육 현장 분 서로 사례 공유 수 ']
# new_model = Word2Vec()

document_list=[]
# i = 0

for line in book_val:
    doc2vec = None
    count = 0
    for word in line.split():
        if word in model.wv.index_to_key:
            count += 1
            
            if doc2vec is None:
                doc2vec = model.wv[word]
            else:
                doc2vec = doc2vec + model.wv[word]

    if doc2vec is not None:
        doc2vec = doc2vec / count
        document_list.append(doc2vec)
    

print(document_list[0]);

# new_model.save('test_model10.model')
# print(document_list[0]);
# print(new_model.wv.most_similar(9791162243008))

# import numpy as np
new_model = KeyedVectors.load_word2vec_format('test_model10')

new_model["t"] =document_list[0];

print(new_model.most_similar("t"))




# # import numpy as np

# # # new_model = Word2Vec()
# # # new_model.wv.load_word2vec_format('test_model10')

# # new_model.wv["t"] = np.random.rand(100)
# # new_model.wv.save_word2vec_format('test_model10')
