import selenium
from selenium import webdriver
from selenium.webdriver import ActionChains

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait

URL = 'https://sso.kmu.ac.kr/kmusso/ext/ctl/login_form.do?Return_Url=http://ctl.kmu.ac.kr/'
driver = webdriver.Chrome(executable_path='chromedriver')
driver.get(url=URL)

driver.find_element_by_id('usr_id').send_keys('5469744')
driver.find_element_by_id('usr_padd').send_keys('insomnia3060')
driver.find_element_by_class_name('blue_btn').click()

driver.implicitly_wait(10)