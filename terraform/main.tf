terraform {
  required_version = ">= 1.5.0"
  
  backend "s3" {
    bucket = "atomquest-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

# --- VPC & Networking Strategy ---
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "atomquest-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  enable_vpn_gateway = false
}

# --- Kubernetes (EKS) Cluster via Terraform ---
# Preparing for Istio/Linkerd Service Mesh Integration
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "atomquest-eks"
  cluster_version = "1.29"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    standard = {
      instance_types = ["t3.medium"]
      min_size     = 2
      max_size     = 5
      desired_size = 3
    }
  }
}

# Future: Deploy Kong or AWS API Gateway here
