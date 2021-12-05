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