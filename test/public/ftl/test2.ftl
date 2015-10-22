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
        <#assign t = 'hello'/>
        ${t}
    <script src="/public/javascript/util.js"></script>
    <script src="/public/javascript/test.js"></script>
    </body>
    </body>
    </html>
    </@compress>
</#escape>