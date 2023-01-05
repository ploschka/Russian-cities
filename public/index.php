<?php

$path = $_SERVER['PATH_INFO'] ?? '/';

if ($path == '/')
    require("./build/index.html");
else
    require("./build/{$path}.html");
