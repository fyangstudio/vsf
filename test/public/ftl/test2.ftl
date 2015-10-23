<#escape x as x?html>
    <@compress>
    <!DOCTYPE html>
    <html>
    <head>
        <title>test</title>
        <#include "./common.ftl">
    </head>
    <body>
        <@topbar/>
        <#--<#assign t = 'hello'/>-->
        ${(t!true)?c}
        ${(t!true)?string(1,2)}
        <img src="/images/img1.png">
        <img src="/images/img2.jpeg">
    <script src="/javascript/util.js"></script>
    <script src="/javascript/test.js"></script>
    </body>
    </body>
    </html>
    </@compress>
</#escape>