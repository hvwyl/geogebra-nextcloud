<?php

namespace OCA\Geogebra\AppInfo;

use OC\Files\Type\Detection;
use OCP\AppFramework\App;

class Application extends App {
    const APPNAME = 'geogebra';

	public function __construct(array $urlParams = array()) {
		parent::__construct(self::APPNAME, $urlParams);
    }
    
	public function registerProvider() {
		$container = $this->getContainer();

		// Register mimetypes
		/** @var Detection $detector */
		$detector = $container->query(\OCP\Files\IMimeTypeDetector::class);
		$detector->getAllMappings();
		$detector->registerType('ggb','application/ggb');
	}
}
