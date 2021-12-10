try:
    import jpype
    import jpype1
except:
    import jpype
from konlpy.tag import Kkma
from konlpy.utils import pprint
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

data = pd.read_csv('./test.csv', encoding='CP949')
cont = data['name'] + data['content']

book_val = cont.values.tolist()



# kkma = Kkma()
# doc_list = []


# for doc in book_val:
#     nouns = kkma.nouns(doc)
#     doc_nouns = ''

#     for noun in nouns:
#         doc_nouns += str(noun) + ' '

    
#     doc_list.append(doc_nouns)



# data.insert(3, 'nouns', doc_list)
# data.to_csv("test2.csv", index=False, encoding='CP949')




# tfidf_vectorizer = TfidfVectorizer(min_df = 1)
# tfidf_matrix = tfidf_vectorizer.fit_transform(doc_list)

# document_distances = (tfidf_matrix * tfidf_matrix.T)

print(book_val[0])


