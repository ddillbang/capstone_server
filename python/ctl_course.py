import requests
from bs4 import BeautifulSoup as bs


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



Login_info = {
    'Return_Url' : 'https://ctl.kmu.ac.kr/index.jsp',
    'loginName' : '5469744',
    'password' : 'insomnia3060'
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
        


