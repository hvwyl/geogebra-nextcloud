<?php

namespace OCA\Geogebra\AppInfo;

use OC\Security\CSP\ContentSecurityPolicy;

$eventDispatcher = \OC::$server->getEventDispatcher();

if (\OC::$server->getUserSession()->isLoggedIn()) {
    $eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function() {
        \OCP\Util::addStyle('geogebra', 'style');
        \OCP\Util::addScript('geogebra', 'main');
    });
}


$eventDispatcher->addListener('OCA\Files_Sharing::loadAdditionalScripts', function () {
    \OCP\Util::addStyle('geogebra', 'style');
    \OCP\Util::addScript('geogebra', 'main');
});


$cspManager = \OC::$server->getContentSecurityPolicyManager();
$csp = new ContentSecurityPolicy();
$csp->addAllowedChildSrcDomain("'self'");
$csp->addAllowedFrameDomain("data:");
$cspManager->addDefaultPolicy($csp);

$app = new Application();
$app->registerProvider();