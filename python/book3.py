from gensim.models import word2vec
from gensim.models import keyedvectors
from gensim.models.keyedvectors import load_word2vec_format
import pandas as pd
from gensim.models.word2vec import Word2Vec
from gensim.models import KeyedVectors
from gensim import models

# data = pd.read_csv('book_nouns4.csv', encoding='CP949')
# cont = data['nouns']
# cn = data['isbn']
# book_val = cont.values.tolist()
# isbn_val = cn.values.tolist()

# # corpus = [sent.strip().split(" ") for sent in book_val]
# # model = Word2Vec(sentences = corpus, vector_size = 100, window = 5, min_count = 10, workers = 4, sg = 0)
# model = Word2Vec.load('word_vector_f.model')
# corpus = []
# new_model = Word2Vec( vector_size=100, window=5, min_count=2,workers=4,sg=0)
#new_model = Word2Vec()
new_model = load_word2vec_format('book_model_f.bin', binary=True)

# book_val = ['메타 버스 에듀 테크 게더 타운 이프 랜드 제페토 가상현실 코스 페이시스 를 교육 현장 활용 혁신 교육 에듀 테크 실현 수 가장 실용 지침 가상현실 증강현실 거울 세계 라이프 깅 인공 지능 미래 인재 위 교육 행사 기획 활용 가이드 요즘 메타 버스 게더 타운 제페토 이프 랜드 이용 온라인 행사 학교 수업 기업 기관 대학 성과 홍보 학술 대회 성과 전시회 신제품 발표회 메타 버스 구축 성공 운영 게더 타운 제페토 이프 랜드 메타 버스 플랫폼 참여자 아바타 이용 상호작용 메타 버스 에듀 테크 메타 버스 분야 가상현실 증강현실 거울 세계 라이프 깅 메타 버스 교육 기획 행사 기획 활용 가이드 기획 메타 버스 에듀 테크 실현 혁신 교육 행사 기획 여러분 도움 네이버 블로그 마련 교육 현장 분 서로 사례 공유 수 ']
# new_model3 = load_word2vec_format('test_model10')
# new_model4 = KeyedVectors.load("dlrjs")

# document_list=[]
# i = -1

# for line in book_val:
#     doc2vec = None
#     count = 0
#     i = i+1
#     for word in line.split():
#         if word in model.wv.index_to_key:
#             count += 1
            
#             if doc2vec is None:
#                 doc2vec = model.wv[word]
#             else:
#                 doc2vec = doc2vec + model.wv[word]

#     if doc2vec is not None:
#         doc2vec = doc2vec / count
#         document_list.append(doc2vec)
        
#         new_model.wv[isbn_val[i]] = doc2vec
#         #new_model.wv.add_vector(isbn_val[i],doc2vec)

import csv

# user_list=[]
new_list=[]

#print(new_model["9791165216351"])
# new_list.append(new_model["9791197338243"])
# user = pd.DataFrame({'id' : 'hwa3060',
#                      'name' : new_list})
# user.to_csv('tttt.csv')



# f = open('user_md.csv','r')
# rdr = csv.reader(f)

# for line in rdr:
#     if line[0] == "hwa3060":
#         user_vector = line[1]
        
# f.close()

# user_vector = str(user_vector)[1:-1]

# for vector in user_vector.split():
#     new_list.append(float(vector))

# c = new_list + new_model["9791197338243"]
# print(c)

# f2 = open('user_md.csv','r')
# rdr2 = csv.reader(f2)
# lines = []
# for line in rdr2:
#     if line[0] == "hwa3060":
#         line[1] = c
#     lines.append(line)
        
# f2.close()

# print(len(lines))

# f3 = open('user_md3.csv', 'w', newline='')
# wr = csv.writer(f3)
# wr.writerow(lines[0])
# wr.writerow(lines[1])
# f3.close


# df1 = pd.read_csv('user_md.csv')
# print(df1["vector"][0])


f = open('user_md_f.csv', 'w', newline='')
wr = csv.writer(f)
wr.writerow(['hwa3060', new_model["9791197338243"]])

# f.close()



    

#print(new_model.most_similar("9791197338243"));

# new_model.save('test_model10.model')
# print(document_list[0]);



# import numpy as np
# new_model = KeyedVectors.load_word2vec_format('test_model10')

# new_model5["f"] =document_list[0];
# new_model5.vectors_norm = None
# new_model5.save_word2vec_format('dlrjs')

# new_model3.add_vectors("t", document_list[0]);
# new_model3.vectors_norm = None
# new_model3.save_word2vec_format("iitt")


# new_model3.wv["f"] = document_list[0];
#new_model4.save('testmodel4_cl.model')
#new_model.save_word2vec_format('test_model')
#new_model3.wv["f"] = document_list[0];


#new_model3.save('testmodel13.model')




# # import numpy as np

# # # new_model = Word2Vec()
# # # new_model.wv.load_word2vec_format('test_model10')

# # new_model.wv["t"] = np.random.rand(100)
# # new_model.wv.save_word2vec_format('test_model10')
