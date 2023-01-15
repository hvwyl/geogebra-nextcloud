<?php
namespace OCA\Geogebra\Migration;

require \OC::$SERVERROOT . "/3rdparty/autoload.php";

use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;
use OCP\ILogger;
use OC\Core\Command\Maintenance\Mimetype\UpdateJS;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\ConsoleOutput;

class InstallStep implements IRepairStep {

    /** @var ILogger */
    protected $logger;
    protected $updateJS;

    public function __construct(ILogger $logger, UpdateJS $updateJS) {
            $this->logger = $logger;
            $this->updateJS = $updateJS;
    }

    /**
    * Returns the step's name
    */
    public function getName() {
            return 'Install Geogebra';
    }

    /**
    * @param IOutput $output
    */
    public function run(IOutput $output) {
        $currentVersion = implode('.', \OC_Util::getVersion());

        /* NC does not have geogebra's icon */
        $this->logger->info("Copy geogebra icon to core/img directory.", ["app" => "geogebra"]);
        $appImagePath = __DIR__ . '/../../img/icon-ggb.svg';
        $coreImagePath = \OC::$SERVERROOT . '/core/img/filetypes/geogebra.svg';
        if (!file_exists($coreImagePath) || md5_file($coreImagePath) !== md5_file($appImagePath)) {
            copy($appImagePath, $coreImagePath);
        }

        /* NC does not have geogebra's mimetype */
        $configDir = \OC::$configDir;
        $mimetypealiasesFile = $configDir . 'mimetypealiases.json';
        $mimetypemappingFile = $configDir . 'mimetypemapping.json';

        $this->appendToFile($mimetypealiasesFile, ['application/ggb' => 'geogebra']);
        $this->appendToFile($mimetypemappingFile, ['ggb' => ['application/ggb']]);
        $this->logger->info("Add .ggb to mimetype list.", ["app" => "geogebra"]);
        $this->updateJS->run(new StringInput(''), new ConsoleOutput());

    }

    private function appendToFile(string $filename, array $data) {
        $obj = [];
        if (file_exists($filename)) {
            $content = file_get_contents($filename);
            $obj = json_decode($content, true);
        }
        foreach ($data as $key => $value) {
            $obj[$key] = $value;
        }
        file_put_contents($filename, json_encode($obj,  JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
    }
}
