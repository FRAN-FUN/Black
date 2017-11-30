// TODO: remove removeFromParent
/* @echo EXPORT */
class Stage extends GameObject {
  constructor() {
    super();

    this.mName = 'stage';

    this.addComponent(new InputComponent());
    this.mScaleMode = StageScaleMode.NORMAL;

    // set default
    // this.scaleMode = StageScaleMode.NORMAL;
  }

  get scaleMode() {
    return this.mScaleMode;
  }

  set scaleMode(value) {
    this.mScaleMode = value;
    this.mScaleX = this.mScaleY = 1 / this.scaleFactor;
    this.setTransformDirty();
  }

  get scaleFactor() {
    return this.mScaleMode === StageScaleMode.NORMAL ? Device.getDevicePixelRatio() : 1;
  }

  get width() {
    return Black.instance.viewport.size.width * this.scaleFactor;
  }

  get height() {
    return Black.instance.viewport.size.height * this.scaleFactor;
  }

  getBounds(space = undefined, includeChildren = true, outRect = undefined) {
    outRect = outRect || new Rectangle();

    return outRect.set(0, 0, this.width, this.height);
  }

  onGetLocalBounds() {
    throw new Error();
  }

  set scaleX(value) { Debug.error('Not allowed.'); }
  set scaleY(value) { Debug.error('Not allowed.'); }

  set pivotX(value) { Debug.error('Not allowed.'); }
  set pivotY(value) { Debug.error('Not allowed.'); }

  set anchorX(value) { Debug.error('Not allowed.'); }
  set anchorY(value) { Debug.error('Not allowed.'); }

  set x(value) { Debug.error('Not allowed.'); }
  set y(value) { Debug.error('Not allowed.'); }

  set rotation(value) { Debug.error('Not allowed.'); }  

  set width(value) { Debug.error('Not allowed.'); }
  set height(value) { Debug.error('Not allowed.'); }  

  set name(value) { Debug.error('Not allowed.'); }  
}

/**
 * A blend mode enum.
 * @cat drivers
 * @enum {string}
 */
/* @echo EXPORT */
var StageScaleMode = {
  NORMAL: 'normal',
  NO_SCALE: 'noScale'
};