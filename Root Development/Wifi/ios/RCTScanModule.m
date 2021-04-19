//
//  RCTScanModule.m
//  Wifi_TrustUp
//
//  Created by Brandon Feldbaus on 2/15/21.
//

#import "RCTScanModule.h"
#import <React/RCTLog.h>
#import "LANProperties.h"

#import "MMLANScanner.h"
#import "YLTCPBroadcaster.h"
#import "MainPresenter.h"

@interface RCTScanModule()<MainPresenterDelegate>
@property (strong, nonatomic) MainPresenter *presenter;
@end


@implementation RCTScanModule


- (NSArray<NSString *> *)supportedEvents {
  return @[@"scanDone", @"scanCancelled", @"scanFailed"];
}

RCT_EXPORT_MODULE(RCTScanModule);
RCT_EXPORT_METHOD(startScan)
{
  //self.presenter = [[MainPresenter alloc]initWithDelegate:self];
  
  //[self.presenter scanButtonClicked];

}


#pragma mark - KVO Observers
-(void)addObserversForKVO {
    
    [self.presenter addObserver:self forKeyPath:@"connectedDevices" options:NSKeyValueObservingOptionNew context:nil];
    [self.presenter addObserver:self forKeyPath:@"progressValue" options:NSKeyValueObservingOptionNew context:nil];
    [self.presenter addObserver:self forKeyPath:@"isScanRunning" options:NSKeyValueObservingOptionNew context:nil];
}

-(void)removeObserversForKVO {
    
    [self.presenter removeObserver:self forKeyPath:@"connectedDevices"];
    [self.presenter removeObserver:self forKeyPath:@"progressValue"];
    [self.presenter removeObserver:self forKeyPath:@"isScanRunning"];
}



#pragma mark - Presenter Delegates
//The delegates methods from Presenters.These methods help the MainPresenter to notify the MainVC for any kind of changes
-(void)mainPresenterIPSearchFinished {
  [self sendEventWithName:@"scanDone" body:@"OMG THE SCAN IS DONE YAYAY"];
};

-(void)mainPresenterIPSearchFailed {
  [self sendEventWithName:@"scanFailed" body:@"OMG THE SCAN FAILED BOOOO"];
};

-(void)mainPresenterIPSearchCancelled {
  [self sendEventWithName:@"scanCancelled" body:@"OMG THE SCAN WAS CANCELLED???"];
};



@end
