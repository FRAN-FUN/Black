import { SoundAtlasClip } from "../audio/SoundAtlasClip";
import { SoundClip } from "../audio/SoundClip";
import { GraphicsData } from "../display/GraphicsData";
import { MessageDispatcher } from "../messages/MessageDispatcher";
import { AtlasTexture } from "../textures/AtlasTexture";
import { Texture } from "../textures/Texture";
import { Asset } from "./Asset";
import { AssetManagerState } from "./AssetManagerState";
import { AtlasTextureAsset } from "./AtlasTextureAsset";
import { BitmapFontAsset, BitmapFontData } from "./BitmapFontAsset";
import { BVGAsset } from "./BVGAsset";
import { FontAsset } from "./FontAsset";
import { JSONAsset } from "./JSONAsset";
import { AssetLoader } from "./loaders/AssetLoader";
import { SoundAtlasAsset } from "./SoundAtlasAsset";
import { TextureAsset } from "./TextureAsset";
import { XMLAsset } from "./XMLAsset";
import { Message } from "../messages/Message";
import { Debug } from "../core/Debug";
import { Black } from "../Black";
import { SoundAsset } from "./SoundAsset";
import { FontFaceAssetLoader } from "./loaders/FontFaceAssetLoader";
import { ImageAssetLoader } from "./loaders/ImageAssetLoader";
import { XHRAssetLoader } from "./loaders/XHRAssetLoader";
import { AssetType } from "./AssetType";
import { LoaderType } from "./LoaderType";
import { VectorTextureAsset } from "./VectorTextureAsset";

class LoaderFactory {
  addLoader(type, url) {
    return 
  }
}

/**
 * Responsible for loading assets and manages its in memory state.
 *
 * @fires Message.PROGRESS
 * @fires Message.COMPLETE
 * @fires Message.ERROR
 *
 * @cat assets
 * @extends MessageDispatcher
 */
export class AssetManager extends MessageDispatcher {
  /**
   * Creates new AssetManager instance. AssetManager exposes static property
   * called 'default' and many internal classes uses default instance.
   */
  constructor() {
    super();

    if (Black.assets === null)
      Black.assets = this;

    /** 
     * @private 
     * @type {string} 
     */
    this.mDefaultPath = '';

    /** 
     * @private 
     * @type {number} 
     */
    this.mTotalLoaded = 0;

    /** 
     * @private 
     * @type {number} 
     */
    this.mTotalPending = 0;

    /** 
     * @private 
     * @type {number} 
     */
    this.mTotalErrors = 0;

    /** 
     * @private 
     * @type {boolean} 
     */
    this.mIsAllLoaded = false;

    /** 
     * @private 
     * @type {number} 
     */
    this.mLoadingProgress = 0;

    /** 
     * @private 
     * @type {Array<Asset>} 
     */
    this.mQueue = [];

    /** 
     * @private 
     * @type {Array<AssetLoader>} 
     */
    this.mLoadersQueue = [];

    /** 
     * @private 
     * @type {AssetManagerState} 
     */
    this.mState = AssetManagerState.NONE;

    this.mAssets = {};
    this.mAssetTypeMap = {};
    this.mLoaderTypeMap = {};

    this.registerDefaultTypes();
  }

  registerDefaultTypes() {
    // Textures
    this.mAssetTypeMap[AssetType.TEXTURE] = TextureAsset;
    this.mAssetTypeMap[AssetType.TEXTURE_ATLAS] = AtlasTextureAsset;

    // Vector
    this.mAssetTypeMap[AssetType.VECTOR_GRAPHICS] = BVGAsset;

    // Vector textures 
    this.mAssetTypeMap[AssetType.VECTOR_TEXTURE_ATLAS] = AtlasTextureAsset;
    this.mAssetTypeMap[AssetType.VECTOR_TEXTURE] = AtlasTextureAsset;
    this.mAssetTypeMap[AssetType.VECTOR_TEXTURE_ATLAS] = VectorTextureAsset;

    // Fonts
    this.mAssetTypeMap[AssetType.FONT] = FontAsset;
    this.mAssetTypeMap[AssetType.BITMAP_FONT] = BitmapFontAsset;

    // JSON & XML
    this.mAssetTypeMap[AssetType.XML] = XMLAsset;
    this.mAssetTypeMap[AssetType.JSON] = JSONAsset;

    // Sounds
    this.mAssetTypeMap[AssetType.SOUND] = SoundAsset;
    this.mAssetTypeMap[AssetType.SOUND_ATLAS] = SoundAtlasAsset;

    // Loaders
    this.mLoaderTypeMap[LoaderType.FONT_FACE] = FontFaceAssetLoader;
    this.mLoaderTypeMap[LoaderType.IMAGE] = ImageAssetLoader;
    this.mLoaderTypeMap[LoaderType.XHR] = XHRAssetLoader;
  }

  getLoader(type, url) {

  }

  setAssetType(name, type) {
    this.mAssetTypeMap[name] = type;
  }

  setLoaderType(name, type) {
    this.mLoaderTypeMap[name] = type;
  }

  /**
   * Adds asset into the loading queue.
   * 
   * @param {string} name 
   * @param {Asset} asset 
   * @returns {void}
   */
  enqueueAsset(name, asset) {
    this.__validateState();
    this.__validateName(asset.type, name);

    this.mQueue.push(asset);
  }

  __getAsset(type, ...args) {
    return new this.mAssetTypeMap[type](...args);
  }

  /**
   * Adds or changes texture to the internal list for future reuse by given name.
   * @param {string} name
   * @param {Texture} texture
   */
  addTexture(name, texture) {
    this.mTextures[name] = texture;
  }

  /**
   * Adds single image to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the image.
   * @returns {void}
   */
  enqueueImage(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.TEXTURE, name, this.mDefaultPath + url));
  }

  /**
   * Adds atlas to the loading queue.
   *
   * @param {string} name     Name of the asset.
   * @param {string} imageUrl Atlas URL.
   * @param {string} dataUrl  URL to the .json file which describes the atlas.
   * @returns {void}
   */
  enqueueAtlas(name, imageUrl, dataUrl) {
    this.enqueueAsset(this.__getAsset(AssetType.TEXTURE_ATLAS, name, this.mDefaultPath + imageUrl, this.mDefaultPath + dataUrl));
  }

  /**
   * Adds bitmap font to the loading queue.
   *
   * @param {string} name     Name of the font.
   * @param {string} imageUrl Image URL.
   * @param {string} xmlUrl   URL to the .xml file which describes the font.
   * @returns {void}
   */
  enqueueBitmapFont(name, imageUrl, xmlUrl) {
    this.enqueueAsset(this.__getAsset(AssetType.BITMAP_FONT, name, this.mDefaultPath + imageUrl, this.mDefaultPath + xmlUrl));
  }

  /**
   * Adds single xml file to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the json.
   * @returns {void}
   */
  enqueueXML(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.XML, name, this.mDefaultPath + url));
  }

  /**
   * Adds single json file to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the json.
   * @returns {void}
   */
  enqueueJSON(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.JSON, name, this.mDefaultPath + url));
  }

  /**
   * Adds single Black Vector Graphics file to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the json.
   *
   * @returns {void}
   */
  enqueueVector(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.VECTOR_GRAPHICS, name, this.mDefaultPath + url));
  }

  /**
   * Adds single Black Vector Graphics file to the loading queue and bakes it into the Texture.
   * 
   * If baked both graphics data and baked texture will be stored inside this AssetManager.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the json.
   * @param {boolean=} [bakeSelf=false] Flag to bake full BVG as texture. If false root will not be baked.
   * @param {boolean=} [bakeChildren=false] Flag to bake each node with id to textures. If false none children nodes will be baked.
   * @param {Array<string>=} [namesToBake=null] Concrete nodes ids to bake. Works only if bakeChildren is set to true.
   *
   * @returns {void}
   */
  enqueueVectorTexture(name, url, bakeSelf = false, bakeChildren = false, namesToBake = null) {
    if (bakeSelf === true || bakeChildren === true)
      this.enqueueAsset(this.__getAsset(AssetType.VECTOR_TEXTURE, name, this.mDefaultPath + url, bakeSelf, bakeChildren, namesToBake));
  }

  /**
   * Adds single Black Vector Graphics file to the loading queue and bakes it into the AtlasTexture.
   * 
   * If baked both graphics data and baked texture will be stored inside this AssetManager.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL of the json.
   * @param {boolean=} [bakeSelf=false] Flag to bake full BVG as texture. If false root will not be baked.
   * @param {boolean=} [bakeChildren=false] Flag to bake each node with id to textures. If false none children nodes will be baked.
   * @param {Array<string>=} [namesToBake=null] Concrete nodes ids to bake. Works only if bakeChildren is set to true.
   *
   * @returns {void}
   */
  enqueueVectorAtlas(name, url, bakeSelf = false, bakeChildren = false, namesToBake = null) {
    if (bakeSelf === true || bakeChildren === true)
      this.enqueueAsset(this.__getAsset(AssetType.VECTOR_TEXTURE_ATLAS, name, this.mDefaultPath + url, bakeSelf, bakeChildren, namesToBake));
  }

  /**
   * Adds single sound to the loading queue.
   *
   * @param {string} name Name of the sound.
   * @param {string} url  The URL of the sound.
   * @returns {void}
   */
  enqueueSound(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.SOUND, name, this.mDefaultPath + url));
  }

  /**
   * Adds sound atlas to the loading queue.
   *
   * @param {string} name Name of the sound.
   * @param {string} soundUrl  The URL of the sound.
   * @param {string} dataUrl  The URL of the data JSON.
   * @returns {void}
   */
  enqueueSoundAtlas(name, soundUrl, dataUrl) {
    this.enqueueAsset(this.__getAsset(AssetType.SOUND_ATLAS, name, this.mDefaultPath + soundUrl, this.mDefaultPath + dataUrl));
  }

  /**
   * Adds local font to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @param {string} url  The URL to the font.
   * @returns {void}
   */
  enqueueFont(name, url) {
    this.enqueueAsset(this.__getAsset(AssetType.FONT, name, this.mDefaultPath + url, true));
  }

  /**
   * Adds Google Font to the loading queue.
   *
   * @param {string} name Name of the asset.
   * @returns {void}
   */
  enqueueGoogleFont(name) {
    this.enqueueAsset(this.__getAsset(AssetType.FONT, name, '', false));
  }

  /**
   * Starts loading all enqueued assets.
   *
   * @fires complete
   * @return {void}
   */
  loadQueue() {
    this.__validateState();
    this.mState = AssetManagerState.LOADING;

    for (let i = 0; i < this.mQueue.length; i++) {
      let item = this.mQueue[i];

      item.onLoaderRequested();

      if (item.loaders.length > 0) {
        item.once(Message.COMPLETE, this.onAssetLoaded, this);
        item.once(Message.ERROR, this.onAssetError, this);
        this.mLoadersQueue.push(...item.loaders);

        this.mTotalPending++;
      }
    }

    // Loader will notify Asset when its ready. Asset will notify AssetManager.
    for (let i = 0; i < this.mLoadersQueue.length; i++) {
      let loader = this.mLoadersQueue[i];
      loader.load();
    }
  }

  /**
   * @protected
   * @ignore
   * @param {Message} msg
   * @return {void}
   */
  onAssetLoaded(msg) {
    this.mTotalLoaded++;
    this.mLoadingProgress = this.mTotalLoaded / this.mTotalPending;

    let item = /** @type {Asset}*/ (msg.sender);
    item.off(Message.COMPLETE, Message.ERROR);

    //if (item.type)
    this.mAssets[item.type][item.name] = item.data;

    // if (item.constructor === TextureAsset)
    //   this.mTextures[item.name] = item.data;
    // else if (item.constructor === AtlasTextureAsset)
    //   this.mAtlases[item.name] = item.data;
    // else if (item.constructor === JSONAsset)
    //   this.mJsons[item.name] = item.data;
    // else if (item.constructor === SoundAsset)
    //   this.mSounds[item.name] = item.data;
    // else if (item.constructor === SoundAtlasAsset)
    //   this.mSoundAtlases[item.name] = item.data;
    // else if (item.constructor === FontAsset)
    //   this.mFonts[item.name] = item.data;
    // else if (item.constructor === XMLAsset)
    //   this.mXMLs[item.name] = item.data;
    // else if (item.constructor === BitmapFontAsset)
    //   this.mBitmapFonts[item.name] = item.data;
    // else if (item.constructor === BVGAsset) {
    //this.mGraphicsData[item.name] = item.data;

    // const bakedTextures = /** @type {Object.<string, CanvasRenderTexture>} */ (item).bakeTextures();

    // for (let name in bakedTextures) {
    //   if (!bakedTextures.hasOwnProperty(name))
    //     continue;

    //   name !== item.name && this.__validateName(name);
    //   this.mVectorTextures[name] = bakedTextures[name];
    // }
    // } else if (item instanceof CustomAsset) {
    //   this.mCustomAssets[item.name] = item.data;
    // } else {
    //   Debug.error(`[AssetManager] Unable to handle asset type ${item}.`);
    // }


    /**
     * Posted when loading progress is changed.
     * @event AssetManager#progress
     */
    this.post(Message.PROGRESS, this.mLoadingProgress);

    if (this.mTotalLoaded === this.mTotalPending) {
      this.mQueue.splice(0, this.mQueue.length);
      this.mLoadersQueue.splice(0, this.mLoadersQueue.length);
      this.mState = AssetManagerState.FINISHED;
      this.mTotalLoaded = 0;
      this.mTotalErrors = 0;
      this.mTotalPending = 0;
      this.mIsAllLoaded = true;

      /**
       * Posted when all assets finished loading.
       * @event AssetManager#complete
       */
      this.post(Message.COMPLETE);
    }
  }

  onAssetError(msg) {
    this.mTotalErrors++;

    let total = this.mTotalLoaded + this.mTotalErrors;
    this.mLoadingProgress = this.mTotalLoaded / this.mTotalPending;

    let item = /** @type {Asset}*/ (msg.sender);

    item.off(Message.COMPLETE, Message.ERROR);
    Debug.warn(`[AssetManager] Error loading asset '${item.name}'.`);

    /**
     * Posted when error occurred while loading assets.
     * @event AssetManager#complete
     */
    this.post(Message.ERROR, item);

    if (total === this.mTotalPending) {
      this.mQueue.splice(0, this.mQueue.length);
      this.mLoadersQueue.splice(0, this.mLoadersQueue.length);
      this.mState = AssetManagerState.FINISHED;
      this.mTotalLoaded = 0;
      this.mTotalErrors = 0;
      this.mTotalPending = 0;
      this.mIsAllLoaded = true;
      this.post(Message.COMPLETE);
    }
  }

  /**
   * Returns BitmapFontData object by given name.
   *
   * @param {string} name The name of the Asset to search.
   * @return {BitmapFontData|null} Returns a BitmapFontData if found or null.
   */
  getBitmapFont(name) {
    /** @type {BitmapFontData} */
    let t = this.mBitmapFonts[name];

    if (t != null)
      return t;

    Debug.warn(`[AssetManager] BitmapFontData '${name}' was not found.`);
    return null;
  }

  /**
   * Returns Texture object by given name.
   *
   * @param {string} name The name of the Asset.
   * @return {Texture|null} Returns a Texture if found or null.
   */
  getTexture(name) {
    /** @type {Texture} */
    let t = this.mAssets[AssetType.TEXTURE][name];

    if (t != null)
      return t;

    let textureAtlases = this.mAssets[AssetType.TEXTURE_ATLAS];
    for (let key in textureAtlases) {
      t = textureAtlases[key].subTextures[name];

      if (t)
        return t;
    }

    Debug.warn(`[AssetManager] Texture '${name}' was not found.`);
    return null;
  }

  getGraphicsData(name) {
    /** @type {GraphicsData} */
    let data = this.mGraphicsData[name];

    if (data)
      return data;

    for (let key in this.mGraphicsData) {
      data = this.mGraphicsData[key].searchNode(name);

      if (data) {
        return data;
      }
    }

    Debug.warn(`[AssetManager] GraphicsData '${name}' was not found.`);
    return null;
  }

  /**
   * Returns array of Texture by given name mask.
   * Searches across all loaded images and atlases.
   *
   * @param {string} nameMask The name mask.
   * @returns {Array<Texture>|null}
   */
  getTextures(nameMask) {
    let out = [];
    let names = [];

    let re = new RegExp('^' + nameMask.split('*').join('.*') + '$');

    // collect single textures
    for (let key in this.mTextures)
      if (re.test(key))
        names.push({ name: key, atlas: null, isBakedVector: false });

    for (let key in this.mVectorTextures)
      if (re.test(key))
        names.push({ name: key, atlas: null, isBakedVector: true });

    // collect textures from all atlases
    for (let key in this.mAtlases) {
      let atlas = this.mAtlases[key];

      for (let key2 in atlas.subTextures)
        if (re.test(key2))
          names.push({ name: key2, atlas: atlas, isBakedVector: false });
    }

    AtlasTexture.naturalSort(names, 'name');

    for (let i = 0; i < names.length; i++) {
      let ao = names[i];

      if (ao.atlas === null) {
        if (ao.isBakedVector === true)
          out.push(this.mVectorTextures[ao.name]);
        else
          out.push(this.mTextures[ao.name]);
      }
      else
        out.push(ao.atlas.mSubTextures[ao.name]);
    }

    if (out.length > 0)
      return out;

    return null;
  }

  /**
   * Returns AtlasTexture by given name.
   *
   * @param {string} name The name of the Asset.
   * @return {AtlasTexture|null} Returns atlas or null.
   */
  getAtlas(name) {
    if (this.mAtlases[name] != null)
      return this.mAtlases[name];

    Debug.warn(`[AssetManager] Atlas '${name}' was not found.`);
    return null;
  }

  /**
   * Returns `SoundClip` by given name.
   *
   * @param {string} name The name of the sound.
   * @return {SoundClip} Returns sound or null.
   */
  getSound(name) {
    /** @type {SoundClip} */
    let t = this.mSounds[name];

    if (t != null)
      return t;

    for (let key in this.mSoundAtlases) {
      t = this.mSoundAtlases[key].subSounds[name];
      if (t != null)
        return t;
    }

    Debug.warn(`[AssetManager] Sound '${name}' was not found.`);
    return null;
  }

  /**
   * Returns `SoundAtlasClip` by given name.
   *
   * @param {string} name The name of the sound.
   * @return {SoundClip} Returns sound or null.
   */
  getSoundAtlas(name) {
    return this.mSoundAtlases[name];
  }

  /**
   * Returns Object parsed from JSON by given name.
   *
   * @param {string} name The name of the JSON asset.
   * @return {Object} Returns object or null.
   */
  getJSON(name) {
    return this.mJsons[name];
  }

  /**
   * Returns Object parsed from `CutsomAsset` by given name.
   *
   * @param {string} name The name of the asset.
   * @return {Object} Returns object or null.
   */
  getCustomAsset(name) {
    return this.mCustomAssets[name];
  }

  __validateState() {
    Debug.assert(this.mState === AssetManagerState.NONE || this.mState === AssetManagerState.FINISHED, 'Illegal state.');
  }

  __validateName(type, name) {
    if (this.mAssets[type] && this.mAssets[type][name])
      Debug.assert(this.mDictionary[name] == null, 'Asset with such name is already added.');
  }

  /**
   * Destroys all loaded resources.
   */
  dispose() { }

  /**
   * Gets/Sets default path for loading. Useful when URLs getting too long.
   * The asset path will be concatenated with defaultPath.
   *
   * @return {string}
   */
  get defaultPath() {
    return this.mDefaultPath;
  }

  /**
   * @param {string} value
   * @return {void}
   */
  set defaultPath(value) {
    this.mDefaultPath = value;
  }

  /**
   * Returns True if all assets were loaded.
   *
   * @return {boolean}
   */
  get isAllLoaded() {
    return this.mIsAllLoaded;
  }

  /**
   * Returns number of errors occurred during loading.
   * @returns {number}
   */
  get numErrors() {
    return this.mTotalErrors;
  }

  /**
   * Returns current state.
   *
   * @returns {AssetManagerState}
   */
  get state() {
    return this.mState;
  }

  /**
   * Always returns 'AssetManager', can be used to overhear AssetManager's messages.
   *
   * @override
   * @readonly
   * @return {string|null}
   */
  get path() {
    return 'AssetManager';
  }
}