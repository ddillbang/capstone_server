import csv

f = open('user_md_f.csv','r')
rdr = csv.reader(f)

for line in rdr:
    if line[0] == "hwa3060":
        user_v = line[1]

f.close()

new_list=[]
user_v = str(user_v)[1:-1]

for vector in user_v.split():
    new_list.append(float(vector))
    
print(new_list)