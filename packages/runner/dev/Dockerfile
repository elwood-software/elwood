FROM amazonlinux:2


RUN yum -y update \
    # systemd is not a hard requirement for Amazon ECS Anywhere, but the installation script currently only supports systemd to run.
    # Amazon ECS Anywhere can be used without systemd, if you set up your nodes and register them into your ECS cluster **without** the installation script.
    && yum -y install systemd unzip curl \
    && yum clean all

RUN mkdir -p /elwood/runner/bin \
             /elwood/runner/workspace

RUN curl -fsSL https://deno.land/install.sh | DENO_DIR=/elwood/runner/deno-data DENO_INSTALL=/elwood/runner /bin/sh 

ENV ELWOOD_RUNNER_ROOT /elwood/runner
ENV ELWOOD_RUNNER_WORKSPACE_DIR /elwood/runner/workspace