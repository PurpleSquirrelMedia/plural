package main

import (
	"github.com/michaeljguarino/chartmart/api"
	"github.com/michaeljguarino/chartmart/template"
	"github.com/urfave/cli"
	"os"
	"io/ioutil"
	"bytes"
)

func testTemplate(c *cli.Context) error {
	client := api.NewClient()
	installations, _ := client.GetInstallations()
	repoName := c.Args().Get(0)
	testTemplate, err := ioutil.ReadAll(os.Stdin)
	if err != nil {
		return err
	}

	for _, installation := range installations {
		if installation.Repository.Name != repoName {
			continue
		}

		ctx := installation.Context
		tmpl, err := template.MakeTemplate(string(testTemplate))
		if err != nil {
			return err
		}
		var buf bytes.Buffer
		buf.Grow(5 * 1024)
		vals := map[string]interface{}{"Values": ctx, "License": installation.License}
		if err := tmpl.Execute(&buf, vals); err != nil {
			return err
		}

		os.Stdout.Write(buf.Bytes())
	}

	return nil
}