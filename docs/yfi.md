svn checkout svn://svn.code.sf.net/p/hotcakes/code/trunk/yfi_cake/setup/coova_json coova_json

## Radius 

'''
radtest op-00001@op ThFwkrGq 127.0.0.1 100 testing123
'''

Test the CakePHP application
http://109.237.88.203/c2/yfi_cake/users/



cd /usr/share/nginx/www/c2/yfi_cake/webroot/files 
perl radscenario.pl <username> <password>


vim /usr/local/etc/raddb/sql.conf
vim /usr/local/etc/raddb/rlm_perl_modules/conf/settings.conf



## Login Page
http://sourceforge.net/apps/trac/hotcakes/wiki/YfiDevelopThirdParty

http://109.237.88.203/c2/yfi_cake/third_parties/json_create_voucher/?key=123456789&voucher_value=1-00-00-00&profile=Test5min&realm=OceanPLaza

vim /usr/share/nginx/www/yfi/voucher_third_party_poc.php

vim /usr/share/nginx/www/c2/yfi_cake/controllers/third_parties_controller.php
function json_create_voucher()

language-pack-da