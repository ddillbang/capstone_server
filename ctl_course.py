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

Login_info = {
    'Return_Url' : 'https://ctl.kmu.ac.kr/index.jsp',
    'loginName' : 'user_id',
    'password' : 'user_password'
}




with requests.Session() as s:
    login_req = s.post('https://sso.kmu.ac.kr/kmusso/ext/ctl/login_process.do', data = Login_info, headers=header)
    html = s.get('https://ctl.kmu.ac.kr/Main.do?cmd=moveMenu&mainDTO.parentMenuId=menu_00026&mainDTO.menuId=menu_00031', cookies=s.cookies, headers = header2)
    soup = bs(html.text, 'html.parser')
    title = soup.select('#listBox > table > tbody')
    print(title)

