import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BrainGamePlatfromShow')
export class BrainGamePlatfromShow extends Component {
   @property(Node)
   videoNode: Node = null;

   @property(Node)
   shareNode: Node = null;

   protected onLoad(): void {
       if(sys.platform == sys.Platform.WECHAT_GAME){
           this.videoNode.active = false;
           this.shareNode.active = true;
       }else{
           this.videoNode.active = true;
           this.shareNode.active = false;
       }
   }
}

