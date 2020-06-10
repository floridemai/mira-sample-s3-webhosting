import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket'
import { MiraStack } from '@nearform/mira'
import { MiraConfig } from '@nearform/mira'
import { Construct } from '@aws-cdk/core'
import { Topic } from '@aws-cdk/aws-sns'
import { CustomResource, CustomResourceProvider } from '@aws-cdk/aws-cloudformation'
import {
  BucketDeployment,
  Source as S3DeploymentSource
} from '@aws-cdk/aws-s3-deployment'
import * as path from 'path'

export default class S3Webhosting extends MiraStack {
  constructor (parent: Construct) {
    super(parent, S3Webhosting.name)
    const account = MiraConfig.getEnvironment()
    const bucketProps = {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    }
    const domainConfig = MiraConfig.getDomainConfig()
    const siteBucket = new AutoDeleteBucket(this, 'SiteBucket', bucketProps)
    this.addOutput('WebsiteURL', siteBucket.bucketWebsiteUrl)

    const webAppPath = path.join(__dirname, '..', '..', 'web-app')
    new BucketDeployment(this, 'Deployment', {
      destinationBucket: siteBucket,
      sources: [
        S3DeploymentSource.asset(webAppPath)
      ]
    })
  }
}
