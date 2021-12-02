from gensim import models

ko_models = models.fasttext.load_facebook_model('cc.ko.300.bin.gz')

print(ko_models.wv.most_similar("컴퓨터",topn=5))