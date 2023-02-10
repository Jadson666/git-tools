import { useEffect, useState } from 'react';
import { Button, useClipboard, Container, Heading } from '@chakra-ui/react';

import './App.css';
import { Code } from './Components/Code';

enum OS {
  MAC = 'Mac'
}

const copyAllBranchCommands = {
  [OS.MAC]: 'git br | pbcopy'
};

const deleteCommandPrefix = 'git br -D';

type Branches = { name: string; checked: boolean }[];

const banList = ['*', 'master', 'main'];

const parseBranchText = (text: string): Branches => {
  const brNames = text
    .replaceAll(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter((brName) => !banList.includes(brName));
  return brNames.map((brName) => ({ name: brName, checked: true }));
};

function App() {
  const { onCopy, value, setValue, hasCopied } = useClipboard(copyAllBranchCommands[OS.MAC]);
  const {
    onCopy: onDeleteCommandCopy,
    value: deleteCommand,
    setValue: setDeleteCommand,
    hasCopied: hasDeleteCommandCopied
  } = useClipboard('');
  const [branches, setBranches] = useState<Branches>([]);

  const readAllBranch = async () => {
    const text = await navigator.clipboard.readText();

    setBranches(parseBranchText(text));
  };

  useEffect(() => {
    console.log(branches)
    if (branches.length > 0) {
      setDeleteCommand(
        `${deleteCommandPrefix} ${branches
          .filter((branch) => branch.checked === true)
          .map((br) => br.name)
          .join(' ')}`
      );
    }
  }, [branches]);

  return (
    <Container className='App'>
      <Heading>Basic Clean Up</Heading>
      run following command in your repository
      <ol className='orderList'>
        <li>
          <Code>{'git remote prune {remote_name}'}</Code>
        </li>
        <li>
          <Code>{'git prune'}</Code>
        </li>
      </ol>
      <Heading>Quick Clean Up</Heading>
      <ol className='orderList'>
        <li>
          <Code>{value}</Code>
          <Button style={{ marginLeft: 20 }} onClick={onCopy}>
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
        </li>
        <li>run command on your local repository</li>
        <li>
          
          <Button style={{ marginRight: 20 }} onClick={readAllBranch}>
            read branch
          </Button>{' '}
          from your ckipboard
        </li>
        <div style={{ textAlign: 'left' }}>
          {branches.map(({ name, checked }) => {
            return (
              <label key={name} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type='checkbox'
                  style={{ marginRight: 10 }}
                  name={name}
                  checked={checked}
                  onChange={(e) => {
                    setBranches((brs) => {
                      const curBranch = brs.find((br) => br.name === name);
                      if (curBranch?.checked !== undefined) curBranch.checked = e.target.checked;
                      return [...brs];
                    });
                  }}
                />
                {name}
              </label>
            );
          })}
        </div>
        {branches.filter(br => br.checked).length > 0 && (
          <li>
            <Code>{deleteCommand}</Code>{' '}
            <Button style={{ marginLeft: 20 }} onClick={onDeleteCommandCopy}>
              {hasDeleteCommandCopied ? 'Copied!' : 'Copy'}
            </Button>
          </li>
        )}
      </ol>
    </Container>
  );
}

export default App;
