<?php

namespace App\Extensions\Doctrine;

use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\AST\Functions\FunctionNode;

/**
* "MATCH_AGAINST" "(" {StateFieldPathExpression ","}* InParameter {Literal}? ")"
*/
class MatchAgainst extends FunctionNode
{
    protected $pathExp = null;
    protected $against = null;
    protected $booleanMode = false;
    protected $queryExpansion = false;

    public function parse(\Doctrine\ORM\Query\Parser $parser)
    {
        // match
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);

        // first Path Expression is mandatory
        $this->pathExp = [];
        $this->pathExp[] = $parser->StateFieldPathExpression();

        // Subsequent Path Expressions are optional
        $lexer = $parser->getLexer();

        while ($lexer->isNextToken(Lexer::T_COMMA))
        {
            $parser->match(Lexer::T_COMMA);

            $this->pathExp[] = $parser->StateFieldPathExpression();
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);

        // against
        if (strtolower($lexer->lookahead['value']) !== 'against')
        {
            $parser->syntaxError('against');
        }

        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);

        $this->against = $parser->StringPrimary();

        if (strtolower($lexer->lookahead['value']) === 'boolean')
        {
            $parser->match(Lexer::T_IDENTIFIER);

            $this->booleanMode = true;
        }

        if (strtolower($lexer->lookahead['value']) === 'expand')
        {
            $parser->match(Lexer::T_IDENTIFIER);

            $this->queryExpansion = true;
        }

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }

    public function getSql(\Doctrine\ORM\Query\SqlWalker $walker)
    {
        $fields = [];

        foreach ($this->pathExp as $pathExp)
        {
            $fields[] = $pathExp->dispatch($walker);
        }

        $against = $walker->walkStringPrimary($this->against)
            . ($this->booleanMode ? ' IN BOOLEAN MODE' : '')
            . ($this->queryExpansion ? ' WITH QUERY EXPANSION' : '');

        return sprintf('MATCH (%s) AGAINST (%s)', implode(', ', $fields), $against);
    }
}

