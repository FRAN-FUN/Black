import { Asset } from "./Asset";
import { XHRAssetLoader } from "./loaders/XHRAssetLoader";
import { AssetType } from "./AssetType";
import { LoaderType } from "./LoaderType";

/**
 * Single JSON file asset class responsible for loading json file.
 *
 * @cat assets
 * @extends Asset
 */
export class JSONAsset extends Asset {
  /**
   * Creates new JSONAsset instance.
   *
   * @param {string} name The name of asset.
   * @param {string} url  URL to the json file.
   * @return {void}
   */
  constructor(name, url) {
    super(AssetType.JSON, name);

    /**
     * @private
     * @type {string}
     */
    this.mUrl = url;

    /** 
     * @private 
     * @type {XHRAssetLoader|null} 
     */
    this.mXHR = null;
  }

  /**
   * @inheritDoc
   */
  onLoaderRequested(factory) {
    this.mXHR = factory.get(LoaderType.XHR, this.mDataUrl);
    this.mXHR.mimeType = 'application/json';
    this.mXHR.responseType = 'json';
    this.addLoader(this.mXHR);
  }

  /**
   * @inheritDoc
   */
  onAllLoaded() {
    super.ready(/** @type {!Object}*/(JSON.parse(/** @type {string} */(this.mXHR.data))));
  }
}
