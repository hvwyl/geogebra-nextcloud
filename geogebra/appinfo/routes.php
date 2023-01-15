<?php

return ['routes' => [
    ['name' => 'FileHandling#save', 'url' => '/ajax/savefile', 'verb' => 'PUT'],
    ['name' => 'FileHandling#load', 'url' => '/ajax/loadfile', 'verb' => 'GET'],
    ['name' => 'PublicFileHandling#save', 'url' => '/ajax/share/savefile', 'verb' => 'PUT'],
    ['name' => 'PublicFileHandling#load', 'url' => '/ajax/share/loadfile/{token}', 'verb' => 'GET'],
]];
